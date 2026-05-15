import "react-native-get-random-values";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../utils";
import MyTextInput from "../../components/MyTextInput";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { completeProfile, getCurrentUser } from "../../redux/slices/authSlice";
import { setCurrentLocation, setCurrentLocationCoordinates } from "../../redux/slices/jobSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

const BasicProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState<{
    city: string;
    state: string;
    country: string;
    fullAddress: string;
    latitude?: number;
    longitude?: number;
  }>({
    city: "",
    state: "",
    country: "",
    fullAddress: "",
  });
  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const navigateHome = () => (navigation as any).navigate("HomeTabs");

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day} ${month} ${year}`;
  };

  const handleCompleteProfile = async () => {
    // Validate required fields
    if (!fullName.trim()) {
      showAlert({
        title: "Error",
        message: "Please enter your full name.",
        type: "error",
      });
      return;
    }

    if (!email.trim()) {
      showAlert({
        title: "Error",
        message: "Please enter your email address.",
        type: "error",
      });
      return;
    }

    if (
      !location.fullAddress &&
      !(location.city || location.state || location.country)
    ) {
      showAlert({
        title: "Error",
        message: "Please select your city.",
        type: "error",
      });
      return;
    }

    if (location.latitude == null || location.longitude == null) {
      showAlert({
        title: "Error",
        message: "Please select a listed location so nearby jobs and notifications can use it.",
        type: "error",
      });
      return;
    }

    // if (!agree) {
    //   showAlert({ title: 'Error', message: 'Please agree to the terms and conditions.', type: 'error' });
    //   return;
    // }
    console.log("location", location);

    try {
      const profileData = {
        fullName: fullName.trim(),
        email: email.trim(),
        location:
          location.fullAddress ||
          `${location.city}, ${location.state}, ${location.country}`.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        dateOfBirth: dob ? dob.toISOString().split("T")[0] : undefined,
      };

      const result = await dispatch(completeProfile(profileData)).unwrap();

      if (result.status === "success") {
        dispatch(setCurrentLocation(profileData.location));
        if (location.latitude != null && location.longitude != null) {
          dispatch(setCurrentLocationCoordinates({
            latitude: location.latitude,
            longitude: location.longitude,
          }));
        }
        try {
          await dispatch(getCurrentUser()).unwrap();
          console.log("Complete profile success, navigating to HomeTabs");
          navigateHome();
        } catch {
          // If getCurrentUser fails, still navigate to HomeTabs
          console.log("Complete profile success, getCurrentUser failed, navigating to HomeTabs");
          navigateHome();
        }
      } else {
        showAlert({
          title: "Error",
          message:
            result.message || "Profile completion failed. Please try again.",
          type: "error",
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Error",
        message:
          error?.message || "Profile completion failed. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView
        edges={["top", "bottom", "left", "right"]}
        style={{ flex: 1 }}
      >
        <StatusBar style="dark" backgroundColor="#EAF2FF" />
        <LinearGradient
          colors={["#EAF2FF", "#FFFFFF", "#F6F9FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.screenBackground}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => (navigation as any).goBack()}
            >
              <AntDesign
                name="arrow-left"
                size={24}
                style={{
                  marginRight: 10,
                  marginTop: 2,
                }}
                color={Colors.black}
              />
            </TouchableOpacity>

            <View style={styles.badge}>
              <MaterialCommunityIcons name="account-check-outline" size={18} color={Colors.primary} />
              <Text style={styles.badgeText}>Profile setup</Text>
            </View>

            <View style={styles.heroWrap}>
              <View style={styles.iconBubble}>
                <Feather name="user-check" size={30} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Complete your profile</Text>
              <Text style={styles.subtitle}>
                Add your basic details so you can start applying and using the app smoothly.
              </Text>
            </View>

            <MyTextInput
              label="Full Name *"
              placeholder="Enter your full name"
              value={fullName}
              onChange={setFullName}
              firstContainerStyle={{ marginTop: 8 }}
            />
            <MyTextInput
              label="Email *"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              keyboardType="email-address"
            />
            <LocationAutocomplete
              label="City *"
              placeholder="Search for your city"
              onLocationSelect={(locationData) => setLocation(locationData)}
            />

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              activeOpacity={0.8}
            >
              <View style={styles.inputWrapperRelative}>
                <MyTextInput
                  label="Age"
                  placeholder="Select date of birth"
                  value={dob ? formatDate(dob) : ""}
                  editable={false}
                />
                <AntDesign
                  name="calendar"
                  size={20}
                  color={Colors.primary}
                  style={styles.trailingIcon}
                />
              </View>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                mode="date"
                value={dob ?? new Date(2000, 0, 1)}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
                onChange={(_, date) => {
                  setShowPicker(false);
                  if (date) setDob(date);
                }}
              />
            )}

            <Button
              label={loading ? "Completing Profile..." : "Continue"}
              onPress={handleCompleteProfile}
              disabled={loading}
              style={[
                styles.continueButton,
                loading && styles.disabledActionButton,
              ]}
            />
          </ScrollView>
        </LinearGradient>
        <Loader visible={loading} message="Completing your profile..." />
        {alertModal}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  screenBackground: {
    flex: 1,
  },
  content: { padding: 20, paddingTop: 12, paddingBottom: 40, flexGrow: 1 },
  backBtn: {
    position: "absolute",
    left: 16,
    top: 12,
    zIndex: 1,
  },
  badge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFFCC",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 44,
    marginBottom: 20,
    gap: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },
  heroWrap: {
    alignItems: "center",
    marginBottom: 18,
  },
  iconBubble: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },
  title: { fontSize: 28, fontWeight: "bold", color: Colors.black, textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.gray, marginTop: 6, textAlign: "center", lineHeight: 22, paddingHorizontal: 20 },
  inputWrapperRelative: { position: "relative" },
  trailingIcon: { position: "absolute", right: 16, bottom: 16 },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    marginTop: 24,
    paddingVertical: 16,
  },
  disabledActionButton: {
    backgroundColor: "#A9B6D6",
    opacity: 0.7,
  },
});

export default BasicProfileScreen;
