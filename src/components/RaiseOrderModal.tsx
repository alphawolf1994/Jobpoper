import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

import { Colors } from "../utils";
import { AppDispatch, RootState } from "../redux/store";
import { raiseOrder } from "../redux/slices/orderSlice";
import {
  SavedLocation,
  clearLastAddedLocation,
  fetchLocations,
} from "../redux/slices/locationsSlice";

interface RaiseOrderModalProps {
  visible: boolean;
  onClose: () => void;
  businessProfileId: string;
  businessName?: string;
}

/**
 * Modal for raising an order against a business profile.
 *
 * Per spec:
 *   - Name + Phone are mandatory, autofilled from the user's profile, editable.
 *   - Location is optional and selected from saved map-backed locations.
 *   - Service/Product detail is optional, a textarea.
 *   - Business profile ID is a hidden reference (passed in via props).
 */
const RaiseOrderModal: React.FC<RaiseOrderModalProps> = ({
  visible,
  onClose,
  businessProfileId,
  businessName,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);
  const raising = useSelector((state: RootState) => state.order.raising);
  const {
    items: savedLocations,
    loading: locationsLoading,
    lastAddedLocation,
  } = useSelector((state: RootState) => state.locations);

  // Autofill values from the logged-in user's profile.
  const defaultName = user?.profile?.fullName || "";
  const defaultPhone = user?.phoneNumber || "";

  const [name, setName] = useState<string>(defaultName);
  const [phone, setPhone] = useState<string>(defaultPhone);
  const [selectedLocation, setSelectedLocation] = useState<SavedLocation | null>(
    null
  );
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [serviceDetail, setServiceDetail] = useState<string>("");
  const shouldSelectLastAddedLocationRef = useRef(false);

  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Re-seed defaults every time the modal opens, in case the profile changed.
  useEffect(() => {
    if (visible) {
      setName(defaultName);
      setPhone(defaultPhone);
      setSelectedLocation(null);
      setServiceDetail("");
      setNameError(null);
      setPhoneError(null);
      dispatch(fetchLocations());
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      visible &&
      lastAddedLocation &&
      shouldSelectLastAddedLocationRef.current
    ) {
      setSelectedLocation(lastAddedLocation);
      shouldSelectLastAddedLocationRef.current = false;
      dispatch(clearLastAddedLocation());
    }
  }, [dispatch, lastAddedLocation, visible]);

  // E.164-ish: optional leading +, then 8–15 digits. Matches the backend.
  const isValidPhone = useMemo(
    () => (value: string) => /^\+?[1-9]\d{7,14}$/.test(String(value).trim()),
    []
  );

  const validate = (): boolean => {
    let ok = true;
    if (!name || !name.trim()) {
      setNameError("Name is required");
      ok = false;
    } else {
      setNameError(null);
    }
    if (!phone || !phone.trim()) {
      setPhoneError("Phone number is required");
      ok = false;
    } else if (!isValidPhone(phone)) {
      setPhoneError("Enter a valid phone number");
      ok = false;
    } else {
      setPhoneError(null);
    }
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!businessProfileId) {
      Toast.show({
        type: "error",
        text1: "Missing business reference",
        text2: "Please reopen the business and try again.",
      });
      return;
    }

    try {
      await dispatch(
        raiseOrder({
          businessProfileId,
          name: name.trim(),
          phoneNumber: phone.trim(),
          location: selectedLocation?.fullAddress || undefined,
          latitude: selectedLocation?.latitude,
          longitude: selectedLocation?.longitude,
          customerLatitude: selectedLocation?.latitude,
          customerLongitude: selectedLocation?.longitude,
          locationName: selectedLocation?.name,
          addressDetails: selectedLocation?.addressDetails,
          serviceDetail: serviceDetail.trim() || undefined,
        })
      ).unwrap();

      Toast.show({
        type: "success",
        text1: "Order raised successfully",
      });
      onClose();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Failed to raise order",
        text2: typeof err === "string" ? err : err?.message || "Please try again.",
      });
    }
  };

  const handleSelectLocation = (location: SavedLocation) => {
    setSelectedLocation(location);
    setLocationPickerVisible(false);
  };

  const handleAddNewLocation = () => {
    shouldSelectLastAddedLocationRef.current = true;
    setLocationPickerVisible(false);
    onClose();
    navigation.navigate("AddLocationScreen");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={26} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Raise an Order</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {businessName ? (
              <Text style={styles.subtitle} numberOfLines={2}>
                Order for {businessName}
              </Text>
            ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>
                Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={name}
                onChangeText={(v) => {
                  setName(v);
                  if (nameError) setNameError(null);
                }}
                placeholder="Your name"
                placeholderTextColor={Colors.gray}
                style={[styles.input, nameError ? styles.inputError : null]}
                returnKeyType="next"
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Phone Number <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={phone}
                onChangeText={(v) => {
                  setPhone(v);
                  if (phoneError) setPhoneError(null);
                }}
                placeholder="+1234567890"
                placeholderTextColor={Colors.gray}
                keyboardType="phone-pad"
                style={[styles.input, phoneError ? styles.inputError : null]}
                returnKeyType="next"
              />
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Location</Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setLocationPickerVisible(true)}
                style={styles.locationSelect}
              >
                <View style={styles.locationSelectTextWrap}>
                  <Text
                    style={
                      selectedLocation
                        ? styles.locationSelectText
                        : styles.locationPlaceholder
                    }
                    numberOfLines={2}
                  >
                    {selectedLocation
                      ? `${selectedLocation.name} - ${selectedLocation.fullAddress}`
                      : "Select location..."}
                  </Text>
                  {selectedLocation?.addressDetails ? (
                    <Text style={styles.locationDetails} numberOfLines={1}>
                      {selectedLocation.addressDetails}
                    </Text>
                  ) : null}
                </View>
                <Ionicons name="chevron-down" size={20} color={Colors.gray} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Service / Product Detail</Text>
              <TextInput
                value={serviceDetail}
                onChangeText={setServiceDetail}
                placeholder="Describe what you need…"
                placeholderTextColor={Colors.gray}
                style={[styles.input, styles.textarea]}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, raising && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={raising}
              activeOpacity={0.9}
            >
              {raising ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="paper-plane" size={18} color={Colors.white} />
                  <Text style={styles.submitButtonText}>Submit Order</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal
          visible={locationPickerVisible}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setLocationPickerVisible(false)}
        >
          <SafeAreaView style={styles.locationModalContainer}>
            <View style={styles.locationModalHeader}>
              <TouchableOpacity
                onPress={() => setLocationPickerVisible(false)}
                style={styles.locationModalClose}
              >
                <Ionicons name="close" size={24} color={Colors.black} />
              </TouchableOpacity>
              <Text style={styles.locationModalTitle}>Select Location</Text>
              <View style={{ width: 36 }} />
            </View>

            <View style={styles.locationModalContent}>
              {locationsLoading && savedLocations.length === 0 ? (
                <View style={styles.emptyLocationsContainer}>
                  <ActivityIndicator color={Colors.primary} />
                </View>
              ) : savedLocations.length === 0 ? (
                <View style={styles.emptyLocationsContainer}>
                  <Ionicons
                    name="location-outline"
                    size={60}
                    color={Colors.lightGray}
                  />
                  <Text style={styles.emptyLocationsTitle}>
                    No saved locations
                  </Text>
                  <Text style={styles.emptyLocationsText}>
                    Add a location with map coordinates to use directions.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={savedLocations}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.locationItem}
                      onPress={() => handleSelectLocation(item)}
                      activeOpacity={0.75}
                    >
                      <View style={styles.locationItemIcon}>
                        <Ionicons
                          name="location-outline"
                          size={18}
                          color={Colors.primary}
                        />
                      </View>
                      <View style={styles.locationItemTextWrap}>
                        <Text style={styles.locationItemName}>{item.name}</Text>
                        <Text style={styles.locationItemAddress} numberOfLines={2}>
                          {item.fullAddress}
                        </Text>
                        {item.addressDetails ? (
                          <Text
                            style={styles.locationItemDetails}
                            numberOfLines={1}
                          >
                            {item.addressDetails}
                          </Text>
                        ) : null}
                      </View>
                      <Ionicons
                        name={
                          selectedLocation?.id === item.id
                            ? "checkmark-circle"
                            : "chevron-forward"
                        }
                        size={21}
                        color={
                          selectedLocation?.id === item.id
                            ? Colors.primary
                            : Colors.gray
                        }
                      />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.locationListContent}
                />
              )}

              <View style={styles.locationModalFooter}>
                <TouchableOpacity
                  style={styles.addLocationButton}
                  activeOpacity={0.9}
                  onPress={handleAddNewLocation}
                >
                  <Ionicons name="add" size={20} color={Colors.white} />
                  <Text style={styles.addLocationButtonText}>
                    Add New Location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

export default RaiseOrderModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  closeButton: {
    padding: 4,
    width: 36,
    alignItems: "flex-start",
  },
  headerSpacer: { width: 36 },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.black,
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 18,
  },
  field: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 6,
  },
  required: { color: "#FF3B30" },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  locationSelect: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 50,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
  },
  locationSelectTextWrap: { flex: 1, paddingRight: 10 },
  locationSelectText: {
    fontSize: 15,
    color: Colors.black,
    fontWeight: "600",
  },
  locationPlaceholder: {
    fontSize: 15,
    color: Colors.gray,
  },
  locationDetails: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.gray,
  },
  inputError: { borderColor: "#FF3B30" },
  textarea: { minHeight: 110 },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 6,
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 8,
  },
  locationModalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  locationModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  locationModalClose: {
    width: 36,
    padding: 4,
    alignItems: "flex-start",
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.black,
  },
  locationModalContent: { flex: 1 },
  locationListContent: { padding: 16, paddingBottom: 110 },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: Colors.white,
  },
  locationItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.BlueLightShade,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationItemTextWrap: { flex: 1, paddingRight: 8 },
  locationItemName: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.black,
  },
  locationItemAddress: {
    marginTop: 3,
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 18,
  },
  locationItemDetails: {
    marginTop: 3,
    fontSize: 12,
    color: Colors.gray,
  },
  emptyLocationsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  emptyLocationsTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "800",
    color: Colors.black,
  },
  emptyLocationsText: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
  },
  locationModalFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  addLocationButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addLocationButtonText: {
    marginLeft: 8,
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
});
