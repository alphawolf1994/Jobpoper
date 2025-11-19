import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../utils";
import Button from "../../components/Button";
import MyTextInput from "../../components/MyTextInput";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import MapView, { Region } from "react-native-maps";
import * as ExpoLocation from "expo-location";
import { useDispatch, useSelector } from "react-redux";
import { saveLocation } from "../../redux/slices/locationsSlice";
import { RootState } from "../../redux/store";
import Loader from "../../components/Loader";
import { useAlertModal } from "../../hooks/useAlertModal";

const AddLocationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.locations);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  const [addressLabel, setAddressLabel] = useState("KPR St");
  const [addressLine, setAddressLine] = useState("");
  const [locationName, setLocationName] = useState("");
  const [region, setRegion] = useState<Region | null>(null);

  const GOOGLE_API_KEY = "AIzaSyDx-5zOU35lqenxx6TCR-OkQRj6cHpi5-U"; // keep consistent with LocationAutocomplete

  const requestAndSetCurrentLocation = useCallback(async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const current = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.Accuracy.Balanced });
    const { latitude, longitude } = current.coords;
    const nextRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(nextRegion);
  }, []);

  useEffect(() => {
    requestAndSetCurrentLocation();
  }, [requestAndSetCurrentLocation]);

  const geocodeAddress = async (fullAddress: string) => {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${GOOGLE_API_KEY}`
      );
      const data = await resp.json();
      if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
        const { lat, lng } = data.results[0].geometry.location;
        const nextRegion: Region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(nextRegion);
      }
    } catch (e) {
      // ignore silently, map will keep previous region
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const r = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await r.json();
      const addr = data?.results?.[0]?.formatted_address;
      if (addr) setAddressLabel(addr);
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Loader visible={loading} message="Saving location..." />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backRow} onPress={() => (navigation as any).goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
            <Text style={styles.headerTitle}>Select location</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 12 }}>
            <LocationAutocomplete
              placeholder="Search for area, street name..."
              label={undefined as any}
              value={addressLabel}
              mode="full"
              onLocationSelect={(loc) => {
                setAddressLabel(loc.fullAddress);
                if (loc.latitude && loc.longitude) {
                  const nextRegion: Region = {
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  };
                  setRegion(nextRegion);
                } else {
                  geocodeAddress(loc.fullAddress);
                }
              }}
            />
          </View>
        </View>

        <View style={styles.mapContainer}>
          {region ? (
            <MapView
              style={styles.mapView}
              region={region}
              onRegionChangeComplete={(r: any) => {
                setRegion(r);
                reverseGeocode(r.latitude, r.longitude);
              }}
            />
          ) : (
            <View style={styles.mapPlaceholder} />
          )}
          {/* Fixed center pin overlay */}
          <View pointerEvents="none" style={styles.centerPinContainer}>
            <Ionicons name="location-sharp" size={44} color={Colors.primary} />
          </View>
          <TouchableOpacity style={styles.useCurrentButton} onPress={requestAndSetCurrentLocation}>
            <Ionicons name="locate-outline" size={16} color={Colors.primary} />
            <Text style={styles.useCurrentButtonText}>Use current location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Address details</Text>

          <MyTextInput
            label="Location name"
            placeholder="e.g. Home, Office"
            value={locationName}
            onChange={setLocationName}
          />

          <MyTextInput
            label="Address details"
            placeholder="E.g. Floor, House no."
            value={addressLine}
            onChange={setAddressLine}
          />

          <Button
            label="Save address"
            onPress={async () => {
              if (!region) {
                showAlert({
                  title: "Error",
                  message: "Please select a location on the map",
                  type: "error",
                });
                return;
              }
              try {
                const result = await dispatch(
                  saveLocation({
                    name: locationName || 'Saved place',
                    fullAddress: addressLabel,
                    latitude: region.latitude,
                    longitude: region.longitude,
                    addressDetails: addressLine,
                    createdAt: Date.now(),
                  }) as any
                );
                if (result.type === 'locations/saveLocation/fulfilled') {
                  (navigation as any).goBack();
                } else if (result.type === 'locations/saveLocation/rejected') {
                  showAlert({
                    title: "Error",
                    message: (result.payload as string) || "Failed to save location",
                    type: "error",
                  });
                }
              } catch (err: any) {
                showAlert({
                  title: "Error",
                  message: err.message || "Failed to save location",
                  type: "error",
                });
              }
            }}
            style={{ marginTop: 10 }}
            disabled={loading}
          />
        </View>
      </ScrollView>
      {alertModal}
    </SafeAreaView>
  );
};

export default AddLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    marginLeft: 6,
  },
  mapContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  mapPlaceholder: {
    height: 380,
    backgroundColor: "#eef2f6",
    alignItems: "center",
    justifyContent: "center",
  },
  mapView: {
    height: 380,
    width: "100%",
  },
  centerPinContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -22, // half of pin size
    marginTop: -36, // a bit above center to simulate pin tip
  },
  useCurrentButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    gap: 6 as any,
  },
  useCurrentButtonText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  formSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionLabel: {
    fontSize: 12,
    color: Colors.gray,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10 as any,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginBottom: 12,
  },
  deliveryRowText: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: "600",
  },
  receiverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10 as any,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    backgroundColor: Colors.white,
    marginTop: 6,
    marginBottom: 6,
  },
  receiverText: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: "500",
  },
});


