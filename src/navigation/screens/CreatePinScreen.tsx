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
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError, getCurrentUser } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

const CreatePinScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state?.auth);
  const loading = authState?.loading || false;
  const error = authState?.error || null;
  const phoneNumber = authState?.phoneNumber || "";
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1); // 1 = create PIN, 2 = confirm PIN
  
  const pinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);
  const confirmPinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);

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

  const handlePinChange = (value: string, index: number, isConfirm = false) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
    
    if (isConfirm) {
      const newConfirmPin = [...confirmPin];
      newConfirmPin[index] = value;
      setConfirmPin(newConfirmPin);

      // Auto-focus next input
      if (value && index < 3) {
        confirmPinInputRefs.current[index + 1]?.focus();
      } else if (value && index === 3) {
        // All 4 digits entered, auto-submit
        setTimeout(() => {
          handleConfirmPin(newConfirmPin);
        }, 100);
      }
    } else {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Auto-focus next input
      if (value && index < 3) {
        pinInputRefs.current[index + 1]?.focus();
      } else if (value && index === 3) {
        // All 4 digits entered, move to confirm step
        setTimeout(() => {
          setStep(2);
          confirmPinInputRefs.current[0]?.focus();
        }, 100);
      }
    }
  };

  const handleKeyPress = (key: string, index: number, isConfirm = false) => {
    if (isConfirm) {
      if (key === 'Backspace' && !confirmPin[index] && index > 0) {
        confirmPinInputRefs.current[index - 1]?.focus();
      }
    } else {
      if (key === 'Backspace' && !pin[index] && index > 0) {
        pinInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleConfirmPin = async (updatedConfirmPin?: string[]) => {
    const currentConfirmPin = updatedConfirmPin || confirmPin;
    const pinString = pin.join('');
    const confirmPinString = currentConfirmPin.join('');
    
    if (pinString.length !== 4) {
      showErrorAlert('Please enter your 4-digit PIN.');
      return;
    }

    if (confirmPinString.length !== 4) {
      showErrorAlert('Please confirm your 4-digit PIN.');
      return;
    }

    if (pinString !== confirmPinString) {
      showErrorAlert('PINs do not match. Please try again.');
      setConfirmPin(['', '', '', '']);
      confirmPinInputRefs.current[0]?.focus();
      return;
    }

    if (!phoneNumber) {
      showErrorAlert('Phone number not found. Please start over.');
      return;
    }

    try {
      const result = await dispatch(registerUser({ 
        phoneNumber: phoneNumber.trim(), 
        pin: pinString 
      })).unwrap();
      
      if (result.status === 'success') {
        // After successful registration, get user details
        try {
          const userResult = await dispatch(getCurrentUser()).unwrap();
          
          if (userResult.status === 'success' && userResult.data?.user) {
            const userData = userResult.data.user;
            
            // Check if profile is complete
            if (userData.profile?.isProfileComplete) {
              showSuccessAlert('Account created successfully!', () => (navigation as any).navigate('HomeTabs'));
            } else {
              showSuccessAlert('Account created successfully! Please complete your profile.', () =>
                (navigation as any).navigate('BasicProfileScreen')
              );
            }
          } else {
            // If getCurrentUser fails, navigate to BasicProfileScreen
            showSuccessAlert('Account created successfully!', () =>
              (navigation as any).navigate('BasicProfileScreen')
            );
          }
        } catch (userError) {
          // If getCurrentUser fails, navigate to BasicProfileScreen
          showSuccessAlert('Account created successfully!', () =>
            (navigation as any).navigate('BasicProfileScreen')
          );
        }
      }
    } catch (error: any) {
      showErrorAlert(error.message || 'Registration failed. Please try again.');
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setStep(1);
      pinInputRefs.current[0]?.focus();
    }
  };

  const handleBackToCreatePin = () => {
    setStep(1);
    setConfirmPin(['', '', '', '']);
  };

  const renderPinInputs = (pinArray: string[], refs: React.RefObject<TextInput>[], isConfirm = false) => {
    return pinArray.map((digit, index) => (
      <TextInput
        key={index}
        ref={(ref) => {
          if (ref) {
            refs.current[index] = ref;
          }
        }}
        style={[
          styles.pinInput,
          digit ? styles.pinInputFilled : styles.pinInputEmpty
        ]}
        value={digit}
        onChangeText={(value) => handlePinChange(value, index, isConfirm)}
        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index, isConfirm)}
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
            <TouchableOpacity style={styles.backBtn} onPress={handleBackToCreatePin}>
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
              {step === 1 ? 'Create Your PIN' : 'Confirm Your PIN'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1 
                ? 'Create a 4-digit PIN for your account'
                : 'Please confirm your 4-digit PIN'
              }
            </Text>
          </View>

          {step === 1 ? (
            <View style={styles.pinSection}>
              <View style={styles.pinContainer}>
                {renderPinInputs(pin, pinInputRefs)}
              </View>
              <Button 
                label="Continue" 
                onPress={() => {
                  if (pin.join('').length === 4) {
                    setStep(2);
                    confirmPinInputRefs.current[0]?.focus();
                  }
                }}
                style={{
                  ...styles.continueButton,
                  backgroundColor: pin.join('').length === 4 ? Colors.primary : Colors.gray,
                  opacity: pin.join('').length === 4 ? 1 : 0.6
                }}
                disabled={pin.join('').length !== 4}
              />
            </View>
          ) : (
            <View style={styles.confirmSection}>
              <Text style={styles.phoneDisplay}>{phoneNumber}</Text>
              <View style={styles.pinContainer}>
                {renderPinInputs(confirmPin, confirmPinInputRefs, true)}
              </View>
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              <Button 
                label={loading ? "Creating Account..." : "Create Account"} 
                onPress={() => handleConfirmPin()}
                style={{
                  ...styles.createButton,
                  backgroundColor: confirmPin.join('').length === 4 ? Colors.primary : Colors.gray,
                  opacity: confirmPin.join('').length === 4 ? 1 : 0.6
                }}
                disabled={loading || confirmPin.join('').length !== 4}
              />
            </View>
          )}
        </ScrollView>
        <Loader visible={loading} message="Creating your account..." />
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
  pinSection: {
    marginTop: 40,
  },
  confirmSection: {
    marginTop: 40,
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
    marginVertical: 40,
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
  continueButton: {
    marginTop: 40,
    borderRadius: 12,
  },
  createButton: {
    marginTop: 40,
    borderRadius: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default CreatePinScreen;