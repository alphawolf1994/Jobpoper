import React, { useRef, useState } from "react";
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
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../utils";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useAlertModal } from "../../hooks/useAlertModal";
import { resetPinApi } from "../../api/forgotPinApis";

// ---------------------------------------------------------------------------
// Step 3 of the Forgot-PIN flow: capture a new 4-digit PIN (entered twice for
// confirmation) and send it to the backend with the reset token from step 2.
// On success we reset the navigation stack so the user lands on LoginScreen
// with no back-history (they can't accidentally swipe back into the OTP flow
// or hit an expired reset token).
// ---------------------------------------------------------------------------
const PIN_LENGTH = 4;

const CreateNewPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  const resetToken: string = (route.params as any)?.resetToken ?? "";
  // phoneNumber is passed through purely so we could show it on the success
  // alert if desired; not required by the API call.
  const phoneNumber: string = (route.params as any)?.phoneNumber ?? "";

  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [confirmPin, setConfirmPin] = useState<string[]>(
    Array(PIN_LENGTH).fill("")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pinRefs = useRef<(TextInput | null)[]>([]);
  const confirmRefs = useRef<(TextInput | null)[]>([]);

  const makeChangeHandler =
    (
      values: string[],
      setValues: (v: string[]) => void,
      refs: (TextInput | null)[],
      onComplete?: () => void
    ) =>
    (value: string, index: number) => {
      const digits = value.replace(/\D/g, "");
      if (!digits) {
        const next = [...values];
        next[index] = "";
        setValues(next);
        return;
      }
      const next = [...values];
      let cursor = index;
      for (const ch of digits) {
        if (cursor >= PIN_LENGTH) break;
        next[cursor] = ch;
        cursor += 1;
      }
      setValues(next);
      if (cursor < PIN_LENGTH) {
        refs[cursor]?.focus();
      } else {
        refs[PIN_LENGTH - 1]?.blur();
        onComplete?.();
      }
    };

  const makeKeyPressHandler =
    (values: string[], refs: (TextInput | null)[]) =>
    (key: string, index: number) => {
      if (key === "Backspace" && !values[index] && index > 0) {
        refs[index - 1]?.focus();
      }
    };

  const handlePinChange = makeChangeHandler(pin, setPin, pinRefs.current, () =>
    confirmRefs.current[0]?.focus()
  );
  const handleConfirmChange = makeChangeHandler(
    confirmPin,
    setConfirmPin,
    confirmRefs.current
  );

  const handlePinKey = makeKeyPressHandler(pin, pinRefs.current);
  const handleConfirmKey = makeKeyPressHandler(confirmPin, confirmRefs.current);

  const handleSubmit = async () => {
    const pinStr = pin.join("");
    const confirmStr = confirmPin.join("");

    if (pinStr.length !== PIN_LENGTH) {
      showAlert({
        title: "Incomplete PIN",
        message: `Please enter a ${PIN_LENGTH}-digit PIN.`,
        type: "error",
      });
      return;
    }
    if (pinStr !== confirmStr) {
      showAlert({
        title: "PINs don't match",
        message: "Please re-enter your new PIN to confirm.",
        type: "error",
      });
      setConfirmPin(Array(PIN_LENGTH).fill(""));
      confirmRefs.current[0]?.focus();
      return;
    }
    if (!resetToken) {
      showAlert({
        title: "Session expired",
        message:
          "Your verification session has expired. Please start the reset process again.",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await resetPinApi(resetToken, pinStr);

      if (result.status !== "success") {
        showAlert({
          title: "Couldn't reset PIN",
          message: result.message || "Please try again.",
          type: "error",
        });
        return;
      }

      // Success — reset the navigation stack so the user lands on LoginScreen
      // with NO back history (can't swipe back to the OTP/CreateNewPin pages,
      // which are now stateless and would just error out).
      showAlert({
        title: "PIN reset successful",
        message: "Please log in with your new PIN.",
        type: "success",
        buttons: [
          {
            label: "Go to login",
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "LoginScreen" }],
                })
              );
            },
          },
        ],
      });
    } catch (error: any) {
      const message = error?.message || "Failed to reset PIN.";
      const isTokenError = /token|expired|unauthor/i.test(message);
      showAlert({
        title: isTokenError ? "Session expired" : "Couldn't reset PIN",
        message: isTokenError
          ? "Your verification session has expired. Please start the reset process again."
          : message,
        type: "error",
        buttons: isTokenError
          ? [
              {
                label: "Start over",
                onPress: () =>
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [
                        { name: "LoginScreen" },
                        {
                          name: "ForgotPinScreen",
                          params: { initialPhone: "" },
                        },
                      ],
                    })
                  ),
              },
            ]
          : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBoxes = (
    values: string[],
    refs: React.MutableRefObject<(TextInput | null)[]>,
    onChange: (value: string, index: number) => void,
    onKey: (key: string, index: number) => void
  ) =>
    values.map((digit, index) => (
      <TextInput
        key={index}
        ref={(ref) => {
          refs.current[index] = ref;
        }}
        style={[styles.pinInput, digit ? styles.pinInputFilled : styles.pinInputEmpty]}
        value={digit}
        onChangeText={(value) => onChange(value, index)}
        onKeyPress={({ nativeEvent }) => onKey(nativeEvent.key, index)}
        keyboardType="number-pad"
        maxLength={index === 0 ? PIN_LENGTH : 1}
        secureTextEntry
        textAlign="center"
        selectTextOnFocus
      />
    ));

  const canSubmit =
    pin.join("").length === PIN_LENGTH &&
    confirmPin.join("").length === PIN_LENGTH;

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
                name="lock-plus-outline"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.badgeText}>New PIN</Text>
            </View>

            <View style={styles.headerWrap}>
              <Text style={styles.title}>Create a new PIN</Text>
              <Text style={styles.subtitle}>
                Choose a 4-digit PIN you'll use to log in.
                {phoneNumber ? "" : ""}
              </Text>
            </View>

            <Text style={styles.fieldLabel}>New PIN</Text>
            <View style={styles.pinRow}>
              {renderBoxes(pin, pinRefs, handlePinChange, handlePinKey)}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 18 }]}>Confirm PIN</Text>
            <View style={styles.pinRow}>
              {renderBoxes(
                confirmPin,
                confirmRefs,
                handleConfirmChange,
                handleConfirmKey
              )}
            </View>

            <Button
              label={isSubmitting ? "Saving..." : "Save new PIN"}
              onPress={handleSubmit}
              style={[
                styles.primaryButton,
                (!canSubmit || isSubmitting) && styles.disabledButton,
              ]}
              disabled={!canSubmit || isSubmitting}
            />
          </ScrollView>
        </LinearGradient>
        <Loader visible={isSubmitting} message="Saving new PIN..." />
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
  headerWrap: { marginBottom: 24 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
    marginBottom: 8,
  },
  pinRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  pinInput: {
    width: 64,
    height: 64,
    borderWidth: 1.5,
    borderRadius: 18,
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.black,
  },
  pinInputEmpty: { borderColor: "#D1DCF6", backgroundColor: "#FFFFFF" },
  pinInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: "#EAF2FF",
  },
  primaryButton: {
    marginTop: 32,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },
  disabledButton: { backgroundColor: "#A9B6D6", opacity: 0.7 },
});

export default CreateNewPinScreen;
