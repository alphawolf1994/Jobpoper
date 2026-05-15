import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../utils";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  clearError,
  getCurrentUser,
  checkPhone,
  sendPhoneVerification,
  setPhoneNumber as setAuthPhoneNumber,
} from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";
import ImagePath from "../../assets/images/ImagePath";

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state?.auth);
  const loading = authState?.loading || false;
  const error = authState?.error || null;
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");
  const [pin, setPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1); // 1 = phone, 2 = PIN
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isSendingResetCode, setIsSendingResetCode] = useState(false);

  const pinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters

    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      pinInputRefs.current[index + 1]?.focus();
    } else if (value && index === 3) {
      // All 4 digits entered, auto-login

    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePhoneSubmit = async () => {
    if (!formattedPhoneNumber.trim()) {
      showAlert({
        title: "Error",
        message: "Please enter your phone number.",
        type: "error",
      });
      return;
    }

    // Basic phone number validation for formatted number with country code
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formattedPhoneNumber)) {
      showAlert({
        title: "Error",
        message: "Please enter a valid phone number with country code.",
        type: "error",
      });
      return;
    }

    try {
      setIsCheckingPhone(true);

      // Check if phone number exists
      const result = await dispatch(checkPhone(formattedPhoneNumber.trim())).unwrap();
      console.log("checkPhone result =>", result);

      if (result.status === 'success' && result.data) {
        const { exists, isActive } = result.data;

        if (!exists) {
          showAlert({
            title: "Account Not Found",
            message: "No account found with this phone number. Please sign up to create an account.",
            type: "warning",
            buttons: [
              {
                label: "Close",
                variant: "secondary",
              },
              {
                label: "Create Account",
                onPress: () => (navigation as any).navigate("SignupPhoneScreen"),
              },
            ],
          });
          return;
        }

        if (!isActive) {
          showAlert({
            title: "Account Deactivated",
            message: "This account is deactivated. Please contact support for assistance.",
            type: "error",
          });
          return;
        }

        // Phone exists and is active, proceed to PIN screen
        setStep(2);
        pinInputRefs.current[0]?.focus();
        return;
      }

      showAlert({
        title: "Check Failed",
        message: result?.message || "We could not verify this number right now. Please try again.",
        type: "error",
      });
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error || "Failed to check phone number. Please try again.",
        type: "error",
      });
    } finally {
      setIsCheckingPhone(false);
    }
  };

  const handleLogin = async () => {
    const pinString = pin.join('');

    if (pinString.length !== 4) {
      showAlert({
        title: "Error",
        message: "Please enter your 4-digit PIN.",
        type: "error",
      });
      return;
    }

    try {
      console.log("formattedPhoneNumber =>", formattedPhoneNumber)
      const result = await dispatch(loginUser({
        phoneNumber: formattedPhoneNumber.trim(),
        pin: pinString
      })).unwrap();

      if (result.status === 'success') {
        // After successful login, get user details
        try {
          const userResult = await dispatch(getCurrentUser()).unwrap();

          if (userResult.status === 'success' && userResult.data?.user) {
            const userData = userResult.data.user;

            // Admin users always go to the admin panel
            if (userData.role === 'admin') {
              (navigation as any).navigate("AdminTabs");
            } else if (userData.profile?.isProfileComplete) {
              // Regular user with complete profile
              (navigation as any).navigate("HomeTabs");
            } else {
              // Regular user with incomplete profile
              (navigation as any).navigate("BasicProfileScreen");
            }
          } else {
            // If no user data, navigate to HomeTabs
            (navigation as any).navigate("HomeTabs");
          }
        } catch {
          // If getCurrentUser fails, still navigate to HomeTabs
          (navigation as any).navigate("HomeTabs");
        }
      }
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error || "Login failed. Please try again.",
        type: "error",
      });
      setPin(['', '', '', '']);
      pinInputRefs.current[0]?.focus();
    }
  };

  const handleBackToPhone = () => {
    setStep(1);
    setPin(['', '', '', '']);
  };

  const handleForgotPin = () => {
    // Hand off to the dedicated Forgot-PIN flow (ForgotPinScreen ->
    // VerifyOtpScreen -> CreateNewPinScreen). That flow calls the proper
    // /auth/forgot-password/* endpoints — the previous implementation here
    // called the signup `/auth/send-verification` endpoint and relied on
    // catching its "already registered" error, which was brittle.
    setPin(['', '', '', '']);
    dispatch(setAuthPhoneNumber(formattedPhoneNumber.trim()));
    (navigation as any).navigate("ForgotPinScreen", {
      initialPhone: phoneNumber, // raw national digits; ForgotPinScreen will re-format
    });
  };

  const renderPinInputs = () => {
    return pin.map((digit, index) => (
      <TextInput
        key={index}
        ref={(ref) => {
          if (ref) {
            pinInputRefs.current[index] = ref;
          }
        }}
        style={[
          styles.pinInput,
          digit ? styles.pinInputFilled : styles.pinInputEmpty
        ]}
        value={digit}
        onChangeText={(value) => handlePinChange(value, index)}
        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
        keyboardType="numeric"
        maxLength={1}
        textAlign="center"
        selectTextOnFocus
      />
    ));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={{ flex: 1 }}>
        <StatusBar style="dark" backgroundColor="#EAF2FF" />
        <LinearGradient
          colors={["#EAF2FF", "#FFFFFF", "#F6F9FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.screenBackground}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {step === 1 && (
              <TouchableOpacity style={styles.backBtn} onPress={() => (navigation as any).goBack()}>
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
            )}

            {step === 2 && (
              <TouchableOpacity style={styles.backBtn} onPress={handleBackToPhone}>
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
            )}

            <View style={styles.badge}>
              <MaterialCommunityIcons
                name={step === 1 ? "shield-check-outline" : "lock-check-outline"}
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.badgeText}>{step === 1 ? "Returning users" : "Secure access"}</Text>
            </View>

            <View style={styles.logoWrap}>
              <Image source={ImagePath.newLogo} style={styles.logoImage} />
              {/* <Text style={styles.brandText}>JobPoper</Text> */}
              <Text style={styles.title}>
                {step === 1 ? 'Welcome back' : 'Enter your PIN'}
              </Text>
              <Text style={styles.subtitle}>
                {step === 1
                  ? 'Login is built for fast access. Start with your phone number and continue in seconds.'
                  : 'Your number is confirmed. Enter the 4-digit PIN to open your account.'
                }
              </Text>
            </View>

            {step === 1 ? (
              <View style={styles.phoneSection}>
                <PhoneNumberInput
                  label="Enter your registered phone number to Login"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    if (error) {
                      dispatch(clearError());
                    }
                  }}
                  onChangeFormattedText={(formattedText) => {
                    setFormattedPhoneNumber(formattedText);
                    if (error) {
                      dispatch(clearError());
                    }
                  }}
                  error={error}
                  firstContainerStyle={{ marginTop: 0 }}
                />
                <Button
                  label="Continue to PIN"
                  onPress={handlePhoneSubmit}
                  style={[
                    styles.continueButton,
                    !formattedPhoneNumber.trim() && styles.disabledActionButton,
                  ]}
                  disabled={!formattedPhoneNumber.trim()}
                />
              </View>
            ) : (
              <View style={styles.pinSection}>
                <View style={styles.pinHeader}>
                  <Text style={styles.pinCaption}>Logging in with</Text>
                  <Text style={styles.phoneDisplay}>{formattedPhoneNumber}</Text>
                </View>
                <View style={styles.pinContainer}>
                  {renderPinInputs()}
                </View>
                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}
                <TouchableOpacity
                  style={styles.forgotPinButton}
                  onPress={handleForgotPin}
                  disabled={isSendingResetCode}
                >
                  <Text style={styles.forgotPinText}>Forgot PIN?</Text>
                </TouchableOpacity>
                <Button
                  label={loading ? "Logging in..." : "Login"}
                  onPress={handleLogin}
                  style={[
                    styles.loginButton,
                    pin.join('').length !== 4 && styles.disabledActionButton,
                  ]}
                  disabled={loading || pin.join('').length !== 4}
                />
              </View>
            )}

            <View style={styles.dividerWrap}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              label="Create New Account"
              onPress={() => (navigation as any).navigate('SignupPhoneScreen')}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
              icon={<Feather name="user-plus" size={18} color={Colors.primary} />}
            />
          </ScrollView>
        </LinearGradient>
        <Loader
          visible={loading || isCheckingPhone}
          message={
            isCheckingPhone
              ? "Checking account..."
              : isSendingResetCode
              ? "Sending verification code..."
              : "Logging you in..."
          }
        />
        {alertModal}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  screenBackground: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 12,
    flex: 1,
    justifyContent: 'center'
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1
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
  logoWrap: {
    alignItems: "center",
    marginBottom: 16
  },
  logoImage: {
    width: 92,
    height: 92,
    resizeMode: "contain",
    marginBottom: 2,
  },
  brandText: {
    color: Colors.primary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20
  },
  phoneSection: {
    marginTop: 0,
  },
  continueButton: {
    borderRadius: 18,
    marginTop: 20,
    backgroundColor: "#123EA7",
    paddingVertical: 16,
  },
  pinSection: {
    marginTop: 0,
  },
  pinHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  pinCaption: {
    fontSize: 13,
    color: Colors.gray,
    marginBottom: 6,
  },
  phoneDisplay: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 4,
  },
  pinInput: {
    width: 64,
    height: 64,
    borderWidth: 1.5,
    borderRadius: 18,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 4,
  },
  pinInputEmpty: {
    borderColor: "#D1DCF6",
    backgroundColor: "#FFFFFF",
  },
  pinInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: "#EAF2FF",
  },
  loginButton: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },
  forgotPinButton: {
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  forgotPinText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  disabledActionButton: {
    backgroundColor: "#A9B6D6",
    opacity: 0.7,
  },
  dividerWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D7E0F2",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.gray,
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: 0,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#C8D7FF",
    paddingVertical: 15,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
  errorText: {
    color: Colors.red,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default LoginScreen;
