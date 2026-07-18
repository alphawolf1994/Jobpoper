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
import Checkbox from "expo-checkbox";
import { Colors } from "../../utils";
import MyTextInput from "../../components/MyTextInput";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import LocationAutocomplete from "../../components/LocationAutocomplete";
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
  const [isProfessional, setIsProfessional] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
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
  const navigateHome = () => (navigation as any).navigate("HomeTabs");

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

    if (!agreeToTerms) {
      showAlert({
        title: "Error",
        message: "Please accept the Terms and Conditions and Privacy Policy to continue.",
        type: "error",
      });
      return;
    }
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
        isProfessional,
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

            {/* Professional / Worker selection */}
            <View style={styles.professionalSection}>
              <Text style={styles.professionalLabel}>Are you a Professional / Worker?</Text>
              <Text style={styles.professionalHint}>
                Select Yes if you offer services and want to showcase your skills to job owners.
              </Text>
              <View style={styles.radioRow}>
                <TouchableOpacity
                  style={[styles.radioOption, !isProfessional && styles.radioOptionSelected]}
                  onPress={() => setIsProfessional(false)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioCircle, !isProfessional && styles.radioCircleSelected]}>
                    {!isProfessional && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.radioText, !isProfessional && styles.radioTextSelected]}>No</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.radioOption, isProfessional && styles.radioOptionSelected]}
                  onPress={() => setIsProfessional(true)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioCircle, isProfessional && styles.radioCircleSelected]}>
                    {isProfessional && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.radioText, isProfessional && styles.radioTextSelected]}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.termsRow}>
              <Checkbox
                value={agreeToTerms}
                onValueChange={setAgreeToTerms}
                color={agreeToTerms ? Colors.primary : undefined}
                style={styles.termsCheckbox}
              />
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => (navigation as any).navigate("TermsAndConditionsScreen")}
                >
                  Terms and Conditions
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => (navigation as any).navigate("PrivacyPolicyScreen")}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <Button
              label={loading ? "Completing Profile..." : "Continue"}
              onPress={handleCompleteProfile}
              disabled={loading || !agreeToTerms}
              style={[
                styles.continueButton,
                (loading || !agreeToTerms) && styles.disabledActionButton,
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
  professionalSection: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  professionalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 4,
  },
  professionalHint: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 14,
    lineHeight: 18,
  },
  radioRow: {
    flexDirection: "row",
    gap: 12,
  },
  radioOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  radioOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: "#EFF6FF",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.gray,
  },
  radioTextSelected: {
    color: Colors.primary,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    gap: 10,
  },
  termsCheckbox: {
    marginTop: 2,
    borderRadius: 4,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: "600",
  },
});

export default BasicProfileScreen;
