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
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError, getCurrentUser } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

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
  
  const pinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);

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

  const handlePhoneSubmit = () => {
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

    setStep(2);
    pinInputRefs.current[0]?.focus();
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
            
            // Check if profile is complete
            if (userData.profile?.isProfileComplete) {
              showAlert({
                title: "Success",
                message: "Login successful!",
                type: "success",
                buttons: [
                  {
                    label: "OK",
                    onPress: () => (navigation as any).navigate("HomeTabs"),
                  },
                ],
              });
            } else {
              showAlert({
                title: "Success",
                message: "Login successful! Please complete your profile.",
                type: "success",
                buttons: [
                  {
                    label: "OK",
                    onPress: () => (navigation as any).navigate("BasicProfileScreen"),
                  },
                ],
              });
            }
          } else {
            showAlert({
              title: "Success",
              message: "Login successful!",
              type: "success",
              buttons: [
                {
                  label: "OK",
                  onPress: () => (navigation as any).navigate("HomeTabs"),
                },
              ],
            });
          }
        } catch (userError) {
          // If getCurrentUser fails, still navigate to HomeTabs
          showAlert({
            title: "Success",
            message: "Login successful!",
            type: "success",
            buttons: [
              {
                label: "OK",
                onPress: () => (navigation as any).navigate("HomeTabs"),
              },
            ],
          });
        }
      }
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error.message || "Login failed. Please try again.",
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

          <View style={styles.logoWrap}>
            <Text style={styles.emoji}>🔐</Text>
            <Text style={styles.title}>
              {step === 1 ? 'Welcome Back!' : 'Enter Your PIN'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1 
                ? 'Enter your phone number to continue'
                : 'Enter your 4-digit PIN to login'
              }
            </Text>
          </View>

          {step === 1 ? (
            <View style={styles.phoneSection}>
              <PhoneNumberInput
                label="Phone Number"
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
                label="Continue" 
                onPress={handlePhoneSubmit}
                style={styles.continueButton}
                disabled={!formattedPhoneNumber.trim()}
              />
            </View>
          ) : (
            <View style={styles.pinSection}>
              {/* <Text style={styles.phoneDisplay}>{formattedPhoneNumber}</Text> */}
              <View style={styles.pinContainer}>
                {renderPinInputs()}
              </View>
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              <Button 
                label={loading ? "Logging in..." : "Login"} 
                onPress={handleLogin}
                style={{
                  ...styles.loginButton,
                  backgroundColor: pin.join('').length === 4 ? Colors.primary : Colors.gray,
                  opacity: pin.join('').length === 4 ? 1 : 0.6
                }}
                disabled={loading || pin.join('').length !== 4}
              />
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('SignupPhoneScreen')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Loader visible={loading} message="Logging you in..." />
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
    marginBottom: 20 
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
  phoneSection: {
    marginTop: 0,
  },
  continueButton: {
    borderRadius: 12,
    marginTop: 20,
  },
  pinSection: {
    marginTop: 0,
  },
  phoneDisplay: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  pinInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  pinInputEmpty: {
    borderColor: Colors.gray,
    backgroundColor: Colors.white,
  },
  pinInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightBlue || '#F0F8FF',
  },
  loginButton: {
    marginTop: 40,
    borderRadius: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 16,
    color: Colors.gray,
    marginRight: 8,
  },
  signupLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default LoginScreen;