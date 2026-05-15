import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../utils";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { useAlertModal } from "../../hooks/useAlertModal";
import { sendForgotPinOtpApi } from "../../api/forgotPinApis";
import { toE164, isValidE164 } from "../../utils/phoneFormat";

// ---------------------------------------------------------------------------
// Step 1 of the Forgot-PIN flow: collect the user's phone number and ask the
// backend to send them a one-time verification code. On success we navigate to
// VerifyOtpScreen, passing along the E.164 number for steps 2 and 3.
// ---------------------------------------------------------------------------
const ForgotPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  // The phone-number input pre-fills with whatever the LoginScreen had typed
  // (passed as route param) so the user doesn't have to re-enter it.
  const initialPhone = (route.params as any)?.initialPhone ?? "";

  // We deliberately do NOT trust `formattedPhoneNumber` from the input — see
  // utils/phoneFormat.ts for why. Instead we keep the raw national digits plus
  // the active calling code and assemble E.164 ourselves on submit.
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhone);
  const [callingCode, setCallingCode] = useState<string>("91"); // India default
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    const e164 = toE164(phoneNumber, callingCode);

    if (!isValidE164(e164)) {
      showAlert({
        title: "Invalid number",
        message:
          "Please enter a valid phone number with the correct country code.",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const result = await sendForgotPinOtpApi(e164);

      if (result.status !== "success") {
        showAlert({
          title: "Could not send code",
          message: result.message || "Please try again.",
          type: "error",
        });
        return;
      }

      (navigation as any).navigate("VerifyOtpScreen", {
        phoneNumber: e164,
      });
    } catch (error: any) {
      const message = error?.message || "Failed to send verification code.";
      // The backend returns 404 "Phone number not found" if no account exists.
      const isNotFound = /not found/i.test(message);
      showAlert({
        title: isNotFound ? "Account not found" : "Error",
        message: isNotFound
          ? "We couldn't find an account with that phone number."
          : message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView edges={["top", "bottom", "left", "right"]} style={{ flex: 1 }}>
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
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AntDesign name="arrow-left" size={24} color={Colors.black} />
            </TouchableOpacity>

            <View style={styles.badge}>
              <MaterialCommunityIcons
                name="lock-reset"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.badgeText}>Forgot PIN</Text>
            </View>

            <View style={styles.headerWrap}>
              <Text style={styles.title}>Reset your PIN</Text>
              <Text style={styles.subtitle}>
                Enter the phone number on your account. We'll send a 6-digit
                verification code so you can set a new PIN.
              </Text>
            </View>

            <View style={styles.formSection}>
              <PhoneNumberInput
                label="Registered phone number"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onChangeCallingCode={setCallingCode}
                firstContainerStyle={{ marginTop: 0 }}
              />

              <Button
                label={isLoading ? "Sending code..." : "Send verification code"}
                onPress={handleSendCode}
                style={[
                  styles.primaryButton,
                  (!phoneNumber.trim() || isLoading) && styles.disabledButton,
                ]}
                disabled={isLoading || !phoneNumber.trim()}
              />

              <TouchableOpacity
                onPress={() => (navigation as any).goBack()}
                style={styles.linkBtn}
              >
                <Text style={styles.linkText}>Back to login</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
        <Loader visible={isLoading} message="Sending verification code..." />
        {alertModal}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  screenBackground: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: 12,
    flexGrow: 1,
    justifyContent: "center",
  },
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
    marginBottom: 20,
    gap: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
  },
  headerWrap: { marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.gray,
    lineHeight: 22,
  },
  formSection: { marginTop: 0 },
  primaryButton: {
    marginTop: 24,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },
  disabledButton: {
    backgroundColor: "#A9B6D6",
    opacity: 0.7,
  },
  linkBtn: {
    alignSelf: "center",
    paddingVertical: 14,
    marginTop: 6,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
});

export default ForgotPinScreen;
