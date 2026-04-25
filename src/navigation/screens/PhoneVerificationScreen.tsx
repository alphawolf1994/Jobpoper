import React, { useState, useRef, useEffect } from "react";
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../utils";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { sendPhoneVerification, resendVerification, setPhoneNumber, verifyPhone } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

const PhoneVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, phoneNumber } = useSelector((state: RootState) => state.auth);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  
  // Check if this is part of signup flow
  const isSignup = (route.params as any)?.isSignup || false;
  const passedPhoneNumber = (route.params as any)?.phoneNumber || phoneNumber;
  
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isCodeSent, setIsCodeSent] = useState(isSignup); // If coming from signup, code is already sent
  const [countdown, setCountdown] = useState(0);
  
  const codeInputRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showErrorAlert = (message: string) =>
    showAlert({
      title: "Error",
      message,
      type: "error",
    });

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    } else if (value && index === 5) {
      // All 6 digits entered, auto-verify
      setTimeout(() => {
        handleVerifyCode(newCode);
      }, 100);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const startCountdown = () => {
    // Clear existing timer if any
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    
    setCountdown(60); // 60 seconds countdown (1 minute)
    
    // Start countdown
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Initialize countdown if coming from signup (code already sent)
  useEffect(() => {
    if (isSignup) {
      // Code was already sent in SignupPhoneScreen, so start countdown immediately
      startCountdown();
    }
  }, [isSignup]);

  // Clear countdown timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const handleSendCode = async () => {
    const currentPhoneNumber = passedPhoneNumber || phoneNumber;
    if (!currentPhoneNumber) {
      showErrorAlert('Phone number not found. Please go back and try again.');
      return;
    }

    try {
      const result = await dispatch(sendPhoneVerification(currentPhoneNumber) as any).unwrap();
      
      if (result.status === 'success') {
        setIsCodeSent(true);
        startCountdown();
        
        showAlert({
          title: "Code Sent",
          message: "Verification code has been sent to your phone number.",
          type: "info",
        });
      }
    } catch (error: any) {
      showErrorAlert(error.message || 'Failed to send verification code. Please try again.');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return; // Prevent resend if countdown is active

    const currentPhoneNumber = passedPhoneNumber || phoneNumber;
    if (!currentPhoneNumber) {
      showErrorAlert('Phone number not found. Please go back and try again.');
      return;
    }

    try {
      const result = await dispatch(resendVerification(currentPhoneNumber) as any).unwrap();
      
      if (result.status === 'success') {
        // Reset countdown to 60 seconds
        startCountdown();
        
        showAlert({
          title: "Code Resent",
          message: "Verification code has been resent to your phone number.",
          type: "info",
        });
      }
    } catch (error: any) {
      showErrorAlert(error.message || 'Failed to resend verification code. Please try again.');
    }
  };

  const handleVerifyCode = async (updatedCode?: string[]) => {
    const currentCode = updatedCode || verificationCode;
    const codeString = currentCode.join('');
    
    if (codeString.length !== 6) {
      showErrorAlert('Please enter the complete 6-digit code.');
      return;
    }

    const currentPhoneNumber = passedPhoneNumber || phoneNumber;
    if (!currentPhoneNumber) {
      showErrorAlert('Phone number not found. Please go back and try again.');
      return;
    }

    try {
      const result = await dispatch(verifyPhone({ 
        phoneNumber: currentPhoneNumber, 
        verificationCode: codeString 
      } as any)).unwrap();
      
      if (result.status === 'success') {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }

        dispatch(setPhoneNumber(currentPhoneNumber));
        console.log("Verify phone success, navigating to CreatePinScreen");
        (navigation as any).navigate('CreatePinScreen');
      }
    } catch (error: any) {
      showErrorAlert(error.message || 'Phone verification failed. Please try again.');
      setVerificationCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
    }
  };

  const renderCodeInputs = () => {
    return verificationCode.map((digit, index) => (
      <TextInput
        key={index}
        ref={(ref) => {
          if (ref) {
            codeInputRefs.current[index] = ref;
          }
        }}
        style={[
          styles.codeInput,
          digit ? styles.codeInputFilled : styles.codeInputEmpty
        ]}
        value={digit}
        onChangeText={(value) => handleCodeChange(value, index)}
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

            <View style={styles.badge}>
              <MaterialCommunityIcons name="cellphone-check" size={18} color={Colors.primary} />
              <Text style={styles.badgeText}>Step 2 of 3</Text>
            </View>

            <View style={styles.logoWrap}>
              <View style={styles.iconBubble}>
                <Feather name="shield" size={30} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Verify your phone</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to your number so we can secure your account.
              </Text>
              <Text style={styles.phoneNumber}>{passedPhoneNumber || phoneNumber}</Text>
            </View>

            <View style={styles.codeContainer}>
              {renderCodeInputs()}
            </View>

            {!isCodeSent ? (
              <Button
                label="Send Verification Code"
                onPress={handleSendCode}
                style={styles.sendButton}
              />
            ) : (
              <View style={styles.verifySection}>
                <Button
                  label="Verify Code"
                  onPress={() => handleVerifyCode()}
                  style={[
                    styles.verifyButton,
                    verificationCode.join('').length !== 6 && styles.disabledActionButton,
                  ]}
                  disabled={loading || verificationCode.join('').length !== 6}
                />

                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendCode}
                  disabled={countdown > 0}
                >
                  <Text style={[
                    styles.resendText,
                    countdown > 0 && styles.resendTextDisabled
                  ]}>
                    {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </LinearGradient>
        <Loader visible={loading} message={isCodeSent ? "Verifying code..." : "Sending code..."} />
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
    marginBottom: 30 
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
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  phoneNumber: {
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 16,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
    paddingHorizontal: 4,
  },
  codeInput: {
    width: 50,
    height: 62,
    borderWidth: 1.5,
    borderRadius: 18,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 4,
  },
  codeInputEmpty: {
    borderColor: "#D1DCF6",
    backgroundColor: "#FFFFFF",
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: "#EAF2FF",
  },
  sendButton: {
    marginTop: 8,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },
  verifySection: {
    marginTop: 8,
  },
  verifyButton: {
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },
  disabledActionButton: {
    backgroundColor: "#A9B6D6",
    opacity: 0.7,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: Colors.gray,
  },
});

export default PhoneVerificationScreen;
