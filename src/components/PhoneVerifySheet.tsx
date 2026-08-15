import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../utils";
import { AppDispatch, RootState } from "../redux/store";
import {
  GateReason,
  clearOtpError,
  resetGate,
  sendMyPhoneOtp,
  verifyMyPhoneOtp,
} from "../redux/slices/phoneVerificationSlice";

const windowHeight = Dimensions.get("window").height;

const SHEET_HEIGHT_PROMPT = Math.min(Math.max(windowHeight * 0.46, 380), 470);
const SHEET_HEIGHT_CODE = Math.min(Math.max(windowHeight * 0.6, 470), 600);

const CODE_LENGTH = 6;
const EMPTY_CODE = ["", "", "", "", "", ""];

export interface PhoneVerifySheetHandle {
  open: () => void;
  close: () => void;
}

interface Props {
  /** Fired once verification succeeds — the host resumes the blocked action. */
  onVerified?: () => void;
  /** Fired when the sheet closes without verifying. */
  onDismiss?: () => void;
  /** Hide sticky CTAs underneath while the sheet is up. */
  onVisibilityChange?: (visible: boolean) => void;
}

const COPY: Record<GateReason, { title: string; body: string }> = {
  post_job: {
    title: "Verify your number to post a task",
    body: "Task seekers need a reachable number to contact you about this task.",
  },
  contact: {
    title: "Verify your number to view contact details",
    body: "We verify numbers before sharing contact details, so everyone on MakeMy Task can be reached.",
  },
  show_interest: {
    title: "Verify your number to show interest",
    body: "Task posters need to be able to call you back if they pick you.",
  },
  business_profile: {
    title: "Verify your number to add a business",
    body: "Customers will use this number to reach your business.",
  },
};

const PhoneVerifySheet = forwardRef<PhoneVerifySheetHandle, Props>(
  ({ onVerified, onDismiss, onVisibilityChange }, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const sheetRef = useRef<any>(null);
    const codeInputRefs = useRef<(TextInput | null)[]>([]);
    const verifiedHandledRef = useRef(false);

    const {
      status,
      error,
      errorCode,
      codeSent,
      resendAvailableAt,
      maskedPhone,
      reason,
    } = useSelector((state: RootState) => state.phoneVerification);
    const userPhone = useSelector(
      (state: RootState) => state.auth.user?.phoneNumber
    );

    const [code, setCode] = useState<string[]>(EMPTY_CODE);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const copy = COPY[reason || "post_job"];
    const displayPhone = maskedPhone || userPhone || "your number";

    const isSending = status === "sending";
    const isVerifying = status === "verifying";
    const isBusy = isSending || isVerifying;
    // Once a code has been sent we stay on the entry view — including after a
    // failed or expired attempt. Only a send that never succeeded leaves the
    // user on the prompt.
    const showCodeView = codeSent || status === "verified";

    // A hard throttle means retrying now is pointless — disable the CTA.
    const isThrottled = errorCode === "RATE_LIMITED";

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }));

    // ── Resend countdown ────────────────────────────────────────────────────
    // Derived from a target timestamp rather than a decrementing counter, so
    // backgrounding the app doesn't freeze it.
    useEffect(() => {
      if (!resendAvailableAt) {
        setSecondsLeft(0);
        return;
      }

      const tick = () => {
        const remaining = Math.ceil((resendAvailableAt - Date.now()) / 1000);
        setSecondsLeft(remaining > 0 ? remaining : 0);
      };

      tick();
      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }, [resendAvailableAt]);

    // ── Keyboard lift ───────────────────────────────────────────────────────
    useEffect(() => {
      const showEvent =
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const hideEvent =
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

      const showSub = Keyboard.addListener(showEvent, (e) =>
        setKeyboardHeight(e.endCoordinates?.height ?? 0)
      );
      const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    // ── Focus the first box as soon as the code view appears ────────────────
    useEffect(() => {
      if (status === "code_sent") {
        const timer = setTimeout(() => codeInputRefs.current[0]?.focus(), 250);
        return () => clearTimeout(timer);
      }
    }, [status]);

    // ── Success → close, then resume the blocked action ─────────────────────
    useEffect(() => {
      if (status !== "verified" || verifiedHandledRef.current) return;
      verifiedHandledRef.current = true;

      Keyboard.dismiss();
      // Brief pause so the success state is visible rather than flashing past.
      const timer = setTimeout(() => {
        sheetRef.current?.close();
        // Wait out the close animation before running the host's action —
        // same 150ms pattern VerificationBottomSheet uses before navigating.
        setTimeout(() => {
          onVerified?.();
          dispatch(resetGate());
        }, 180);
      }, 550);

      return () => clearTimeout(timer);
    }, [status, onVerified, dispatch]);

    const resetLocal = () => {
      setCode(EMPTY_CODE);
      setSecondsLeft(0);
    };

    const handleSend = () => {
      if (isBusy || isThrottled) return;
      dispatch(sendMyPhoneOtp());
    };

    const handleResend = () => {
      if (secondsLeft > 0 || isBusy || isThrottled) return;
      setCode(EMPTY_CODE);
      codeInputRefs.current[0]?.focus();
      dispatch(sendMyPhoneOtp());
    };

    const submitCode = (value: string) => {
      if (value.length !== CODE_LENGTH || isVerifying) return;
      Keyboard.dismiss();
      dispatch(verifyMyPhoneOtp(value));
    };

    const handleCodeChange = (raw: string, index: number) => {
      // Handle SMS autofill / paste of the whole code into one box.
      const digits = raw.replace(/\D/g, "");

      if (digits.length > 1) {
        const filled = digits.slice(0, CODE_LENGTH).split("");
        const next = [...EMPTY_CODE];
        filled.forEach((d, i) => (next[i] = d));
        setCode(next);
        if (error) dispatch(clearOtpError());

        const lastIndex = Math.min(filled.length, CODE_LENGTH) - 1;
        codeInputRefs.current[lastIndex]?.focus();
        if (filled.length === CODE_LENGTH) submitCode(filled.join(""));
        return;
      }

      const next = [...code];
      next[index] = digits;
      setCode(next);
      if (error) dispatch(clearOtpError());

      if (digits && index < CODE_LENGTH - 1) {
        codeInputRefs.current[index + 1]?.focus();
      } else if (digits && index === CODE_LENGTH - 1) {
        submitCode(next.join(""));
      }
    };

    const handleKeyPress = (key: string, index: number) => {
      if (key === "Backspace" && !code[index] && index > 0) {
        codeInputRefs.current[index - 1]?.focus();
      }
    };

    // Clear the boxes after a bad code so the user isn't editing a dead value.
    useEffect(() => {
      if (status === "error" && (errorCode === "INVALID_CODE" || errorCode === "CODE_EXPIRED")) {
        setCode(EMPTY_CODE);
        const timer = setTimeout(() => codeInputRefs.current[0]?.focus(), 120);
        return () => clearTimeout(timer);
      }
    }, [status, errorCode]);

    const handleClose = () => {
      resetLocal();
      onVisibilityChange?.(false);

      // On the success path the verified-effect owns the teardown: it fires
      // onVerified() and dispatches resetGate() after the close animation.
      // Resetting here too would flip status out of "verified" mid-animation
      // and race that sequence, so we leave it alone.
      if (status === "verified") return;

      dispatch(resetGate());
      onDismiss?.();
    };

    const primaryLabel = useMemo(() => {
      if (isSending) return "Sending...";
      if (isVerifying) return "Verifying...";
      if (status === "verified") return "Verified";
      return showCodeView ? "Verify" : "Send code";
    }, [isSending, isVerifying, status, showCodeView]);

    const codeString = code.join("");
    const primaryDisabled =
      isBusy ||
      isThrottled ||
      status === "verified" ||
      (showCodeView && codeString.length !== CODE_LENGTH);

    return (
      <RBSheet
        ref={sheetRef}
        height={showCodeView ? SHEET_HEIGHT_CODE : SHEET_HEIGHT_PROMPT}
        openDuration={280}
        // Never let a backdrop tap orphan an in-flight request.
        closeOnPressMask={!isBusy}
        closeOnPressBack={!isBusy}
        draggable={!isBusy}
        onOpen={() => {
          resetLocal();
          // Only cleared on a deliberate reopen, never on close — otherwise the
          // success effect could re-arm and fire the pending action twice.
          verifiedHandledRef.current = false;
          onVisibilityChange?.(true);
        }}
        onClose={handleClose}
        customModalProps={{
          animationType: "slide",
          statusBarTranslucent: true,
        }}
        customStyles={{
          wrapper: { backgroundColor: "rgba(8, 20, 52, 0.34)" },
          container: {
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            backgroundColor: "#F8FAFF",
          },
          draggableIcon: { backgroundColor: "#C7D4F6", width: 62 },
        }}
      >
        <View
          style={[
            styles.sheetContent,
            keyboardHeight > 0 && Platform.OS === "ios"
              ? { paddingBottom: keyboardHeight * 0.5 }
              : null,
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <LinearGradient
              colors={
                status === "verified"
                  ? ["#F0FDF4", "#FFFFFF"]
                  : ["#EAF2FF", "#FFFFFF"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.iconWrap}>
                {status === "verified" ? (
                  <Ionicons name="checkmark-circle" size={38} color={Colors.green} />
                ) : (
                  <Feather
                    name={showCodeView ? "message-square" : "smartphone"}
                    size={30}
                    color={Colors.primary}
                  />
                )}
              </View>

              {status === "verified" ? (
                <>
                  <Text style={styles.title}>Number verified</Text>
                  <Text style={styles.subtitle}>
                    Thanks — picking up where you left off.
                  </Text>
                </>
              ) : showCodeView ? (
                <>
                  <Text style={styles.title}>Enter the 6-digit code</Text>
                  <Text style={styles.subtitle}>
                    We sent it to {displayPhone}
                  </Text>

                  <View style={styles.codeRow}>
                    {code.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(el) => {
                          codeInputRefs.current[index] = el;
                        }}
                        style={[
                          styles.codeInput,
                          digit ? styles.codeInputFilled : styles.codeInputEmpty,
                          !!error && styles.codeInputError,
                        ]}
                        value={digit}
                        onChangeText={(value) => handleCodeChange(value, index)}
                        onKeyPress={({ nativeEvent }) =>
                          handleKeyPress(nativeEvent.key, index)
                        }
                        keyboardType="number-pad"
                        maxLength={CODE_LENGTH}
                        textAlign="center"
                        selectTextOnFocus
                        editable={!isVerifying}
                        textContentType="oneTimeCode"
                        autoComplete={
                          Platform.OS === "android" ? "sms-otp" : "one-time-code"
                        }
                      />
                    ))}
                  </View>

                  {!!error && <Text style={styles.errorText}>{error}</Text>}

                  <View style={styles.resendRow}>
                    {secondsLeft > 0 ? (
                      <Text style={styles.resendMuted}>
                        Resend code in {secondsLeft}s
                      </Text>
                    ) : (
                      <TouchableOpacity
                        onPress={handleResend}
                        disabled={isBusy || isThrottled}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text
                          style={[
                            styles.resendLink,
                            (isBusy || isThrottled) && styles.resendDisabled,
                          ]}
                        >
                          Resend code
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.title}>{copy.title}</Text>
                  <Text style={styles.subtitle}>{copy.body}</Text>

                  <View style={styles.phoneChip}>
                    <Feather name="phone" size={16} color={Colors.primary} />
                    <Text style={styles.phoneChipText}>{displayPhone}</Text>
                  </View>

                  <Text style={styles.helper}>
                    We'll send a 6-digit code by SMS. This is a one-time step.
                  </Text>

                  {!!error && <Text style={styles.errorText}>{error}</Text>}
                </>
              )}

              {status !== "verified" && (
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    primaryDisabled && styles.primaryButtonDisabled,
                  ]}
                  onPress={showCodeView ? () => submitCode(codeString) : handleSend}
                  disabled={primaryDisabled}
                  activeOpacity={0.85}
                >
                  {isBusy ? (
                    <ActivityIndicator color={Colors.white} size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
                  )}
                </TouchableOpacity>
              )}

              {status !== "verified" && !isBusy && (
                <TouchableOpacity
                  style={styles.laterButton}
                  onPress={() => sheetRef.current?.close()}
                >
                  <Text style={styles.laterText}>Not now</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </ScrollView>
        </View>
      </RBSheet>
    );
  }
);

PhoneVerifySheet.displayName = "PhoneVerifySheet";

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 18,
  },
  card: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: "#DCE7FF",
  },
  iconWrap: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#121826",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: "#5E6778",
    marginBottom: 16,
    textAlign: "center",
  },
  phoneChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 8,
    backgroundColor: "#FFFFFFD6",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#DCE7FF",
    marginBottom: 14,
  },
  phoneChipText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#121826",
    letterSpacing: 0.4,
  },
  helper: {
    fontSize: 13,
    lineHeight: 18,
    color: "#7A8394",
    textAlign: "center",
    marginBottom: 16,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  codeInput: {
    width: 46,
    height: 56,
    borderWidth: 2,
    borderRadius: 14,
    fontSize: 22,
    fontWeight: "700",
    color: "#121826",
  },
  codeInputEmpty: {
    borderColor: "#D7E0F2",
    backgroundColor: Colors.white,
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: "#EEF4FF",
  },
  codeInputError: {
    borderColor: "#FCA5A5",
  },
  errorText: {
    fontSize: 13.5,
    lineHeight: 19,
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  resendRow: {
    alignItems: "center",
    marginBottom: 16,
  },
  resendMuted: {
    fontSize: 14,
    color: "#7A8394",
    fontWeight: "600",
  },
  resendLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "800",
  },
  resendDisabled: {
    color: "#A9B6D6",
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
  primaryButtonDisabled: {
    backgroundColor: "#A9B6D6",
    opacity: 0.75,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  laterButton: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  laterText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default PhoneVerifySheet;
