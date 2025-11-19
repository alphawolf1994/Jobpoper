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
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { sendPhoneVerification, verifyPhone } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

const PhoneVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, phoneNumber } = useSelector((state: RootState) => state.auth);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  
  // Check if this is part of signup flow
  const isSignup = (route.params as any)?.isSignup || false;
  const passedPhoneNumber = (route.params as any)?.phoneNumber || phoneNumber;
  
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const codeInputRefs = useRef<(TextInput | null)[]>([null, null, null, null, null, null]);

  const showErrorAlert = (message: string) =>
    showAlert({
      title: "Error",
      message,
      type: "error",
    });

  const showSuccessAlert = (message: string, onConfirm: () => void) =>
    showAlert({
      title: "Success",
      message,
      type: "success",
      buttons: [
        {
          label: "OK",
          onPress: onConfirm,
        },
      ],
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
        setCountdown(60); // 60 seconds countdown
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
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
        showSuccessAlert('Phone number verified successfully!', () =>
          (navigation as any).navigate('CreatePinScreen')
        );
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
            <Text style={styles.title}>Verify Your Phone</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to{'\n'}
              <Text style={styles.phoneNumber}>{passedPhoneNumber || phoneNumber}</Text>
            </Text>
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
                style={{
                  ...styles.verifyButton,
                  backgroundColor: verificationCode.join('').length === 6 ? Colors.primary : Colors.gray,
                  opacity: verificationCode.join('').length === 6 ? 1 : 0.6
                }}
                disabled={loading || verificationCode.join('').length !== 6}
              />
              
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleSendCode}
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
  sendButton: {
    marginTop: 40,
    borderRadius: 12,
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
});

export default PhoneVerificationScreen;
