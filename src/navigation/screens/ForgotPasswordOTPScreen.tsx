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
import { Colors } from "../../utils";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordOtp, verifyForgotPasswordOtp, clearError } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

const ForgotPasswordOTPScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, resetPhoneNumber } = useSelector((state: RootState) => state.auth);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  
  const passedPhoneNumber = (route.params as any)?.phoneNumber || resetPhoneNumber;
  
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  
  const codeInputRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    } else if (value && index === 5) {
      // All 6 digits entered, auto-verify
      setTimeout(() => {
        handleVerifyOtp(newCode);
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
    
    setCountdown(60); // 60 seconds countdown
    
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

  // Initialize countdown on mount
  useEffect(() => {
    startCountdown();
  }, []);

  // Clear countdown timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const handleResendOtp = async () => {
    if (countdown > 0) return; // Prevent resend if countdown is active

    if (!passedPhoneNumber) {
      showAlert({
        title: "Error",
        message: "Phone number not found. Please go back and try again.",
        type: "error",
      });
      return;
    }

    try {
      const result = await dispatch(sendForgotPasswordOtp(passedPhoneNumber)).unwrap();
      
      if (result.status === 'success') {
        startCountdown();
        
        showAlert({
          title: "OTP Resent",
          message: "Verification code has been resent to your phone number.",
          type: "info",
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error || "Failed to resend OTP. Please try again.",
        type: "error",
      });
    }
  };

  const handleVerifyOtp = async (updatedCode?: string[]) => {
    const currentCode = updatedCode || verificationCode;
    const codeString = currentCode.join('');
    
    if (codeString.length !== 6) {
      showAlert({
        title: "Error",
        message: "Please enter the complete 6-digit code.",
        type: "error",
      });
      return;
    }

    if (!passedPhoneNumber) {
      showAlert({
        title: "Error",
        message: "Phone number not found. Please go back and try again.",
        type: "error",
      });
      return;
    }

    try {
      const result = await dispatch(verifyForgotPasswordOtp({ 
        phoneNumber: passedPhoneNumber, 
        verificationCode: codeString 
      })).unwrap();
      
      if (result.status === 'success') {
        showAlert({
          title: "Success",
          message: "OTP verified successfully!",
          type: "success",
          buttons: [
            {
              label: "OK",
              onPress: () => {
                (navigation as any).navigate("ResetPinScreen");
              },
            },
          ],
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error || "OTP verification failed. Please try again.",
        type: "error",
      });
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

          <View style={styles.logoWrap}>
            <Text style={styles.emoji}>📱</Text>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to{'\n'}
              <Text style={styles.phoneNumber}>{passedPhoneNumber}</Text>
            </Text>
          </View>

          <View style={styles.codeContainer}>
            {renderCodeInputs()}
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <View style={styles.verifySection}>
            <Button 
              label="Verify OTP" 
              onPress={() => handleVerifyOtp()}
              style={{
                ...styles.verifyButton,
                backgroundColor: verificationCode.join('').length === 6 ? Colors.primary : Colors.gray,
                opacity: verificationCode.join('').length === 6 ? 1 : 0.6
              }}
              disabled={loading || verificationCode.join('').length !== 6}
            />
            
            <TouchableOpacity 
              style={styles.resendButton}
              onPress={handleResendOtp}
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
        </ScrollView>
        <Loader visible={loading} message="Verifying OTP..." />
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
  logoWrap: { 
    alignItems: "center", 
    marginBottom: 50 
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
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
  phoneNumber: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 4,
  },
  codeInputEmpty: {
    borderColor: Colors.gray,
    backgroundColor: Colors.white,
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightBlue || '#F0F8FF',
  },
  verifySection: {
    marginTop: 40,
  },
  verifyButton: {
    borderRadius: 12,
    marginBottom: 16,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default ForgotPasswordOTPScreen;
