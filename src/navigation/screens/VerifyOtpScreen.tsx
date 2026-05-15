import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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
import { useAlertModal } from "../../hooks/useAlertModal";
import {
  sendForgotPinOtpApi,
  verifyForgotPinOtpApi,
} from "../../api/forgotPinApis";
import { maskPhone } from "../../utils/phoneFormat";

// ---------------------------------------------------------------------------
// Step 2 of the Forgot-PIN flow: collect the 6-digit OTP and exchange it for
// a short-lived reset token (10-minute JWT) from the backend. On success we
// hand the token off to CreateNewPinScreen.
//
// Note: the backend's TwilioService falls back to the hard-coded code "000000"
// when Twilio isn't configured OR returns a trial/invalid-To error, so testers
// can always punch in 000000 and proceed.
// ---------------------------------------------------------------------------
const RESEND_SECONDS = 60;
const OTP_LENGTH = 6;

const VerifyOtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  const phoneNumber: string = (route.params as any)?.phoneNumber ?? "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Resend cooldown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  useEffect(() => {
    // Auto-focus the first OTP cell when the screen mounts.
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (value: string, index: number) => {
    // The numeric keyboard on iOS sometimes lets a paste deliver multiple
    // chars at once — handle that gracefully.
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }

    const next = [...otp];
    let cursor = index;
    for (const ch of digits) {
      if (cursor >= OTP_LENGTH) break;
      next[cursor] = ch;
      cursor += 1;
    }
    setOtp(next);
    if (cursor < OTP_LENGTH) {
      inputRefs.current[cursor]?.focus();
    } else {
      inputRefs.current[OTP_LENGTH - 1]?.blur();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      showAlert({
        title: "Incomplete code",
        message: `Please enter all ${OTP_LENGTH} digits.`,
        type: "error",
      });
      return;
    }

    try {
      setIsVerifying(true);
      const result = await verifyForgotPinOtpApi(phoneNumber, code);

      const resetToken = result?.data?.resetToken;
      if (result.status !== "success" || !resetToken) {
        showAlert({
          title: "Verification failed",
          message: result.message || "Invalid or expired code. Please try again.",
          type: "error",
        });
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        return;
      }

      (navigation as any).navigate("CreateNewPinScreen", {
        phoneNumber,
        resetToken,
      });
    } catch (error: any) {
      showAlert({
        title: "Verification failed",
        message: error?.message || "Invalid or expired code. Please try again.",
        type: "error",
      });
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending) return;
    try {
      setIsResending(true);
      const result = await sendForgotPinOtpApi(phoneNumber);
      if (result.status === "success") {
        setSecondsLeft(RESEND_SECONDS);
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
        showAlert({
          title: "Code resent",
          message: "We've sent a new code to your phone.",
          type: "success",
        });
      } else {
        showAlert({
          title: "Couldn't resend",
          message: result.message || "Please try again in a moment.",
          type: "error",
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Couldn't resend",
        message: error?.message || "Please try again in a moment.",
        type: "error",
      });
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.join("").length === OTP_LENGTH;

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
                name="shield-key-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.badgeText}>Verify code</Text>
            </View>

            <View style={styles.headerWrap}>
              <Text style={styles.title}>Enter the 6-digit code</Text>
              <Text style={styles.subtitle}>
                We sent a code to {maskPhone(phoneNumber)}. Enter it below to
                continue.
              </Text>
            </View>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : styles.otpInputEmpty,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleChange(value, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={index === 0 ? OTP_LENGTH : 1}
                  textAlign="center"
                  selectTextOnFocus
                  returnKeyType="done"
                />
              ))}
            </View>

            <View style={styles.resendRow}>
              {secondsLeft > 0 ? (
                <Text style={styles.timerText}>
                  Resend code in {secondsLeft}s
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend} disabled={isResending}>
                  <Text style={styles.resendText}>
                    {isResending ? "Resending..." : "Resend code"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Button
              label={isVerifying ? "Verifying..." : "Verify"}
              onPress={handleVerify}
              style={[
                styles.primaryButton,
                (!isComplete || isVerifying) && styles.disabledButton,
              ]}
              disabled={!isComplete || isVerifying}
            />
          </ScrollView>
        </LinearGradient>
        <Loader visible={isVerifying} message="Verifying..." />
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
  backBtn: { position: "absolute", left: 16, top: 12, zIndex: 1 },
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
  badgeText: { fontSize: 13, fontWeight: "700", color: Colors.primary },
  headerWrap: { marginBottom: 28 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.gray,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 14,
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.black,
  },
  otpInputEmpty: {
    borderColor: "#D1DCF6",
    backgroundColor: "#FFFFFF",
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: "#EAF2FF",
  },
  resendRow: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  timerText: { fontSize: 14, color: Colors.gray },
  resendText: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: "700",
  },
  primaryButton: {
    borderRadius: 18,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },
  disabledButton: { backgroundColor: "#A9B6D6", opacity: 0.7 },
});

export default VerifyOtpScreen;
