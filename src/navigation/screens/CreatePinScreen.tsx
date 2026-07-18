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
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../utils";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError, getCurrentUser, changePin } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

const CreatePinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state?.auth);
  const loading = authState?.loading || false;
  const error = authState?.error || null;
  const phoneNumber = authState?.phoneNumber || "";
  const isResetPin = (route.params as any)?.isResetPin || false;
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
      if (isResetPin) {
        const result = await dispatch(changePin(pinString)).unwrap();

        if (result.status === 'success') {
          showAlert({
            title: "PIN Reset",
            message: "Your PIN has been updated. Please login with your new PIN.",
            type: "success",
            buttons: [
              {
                label: "Login",
                onPress: () => (navigation as any).navigate('LoginScreen'),
              },
            ],
          });
        }
        return;
      }

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
              console.log("Register success, navigating to HomeTabs");
              (navigation as any).navigate('HomeTabs');
            } else {
              console.log("Register success, navigating to BasicProfileScreen");
              (navigation as any).navigate('BasicProfileScreen');
            }
          } else {
            // If getCurrentUser fails, navigate to BasicProfileScreen
            console.log("Register success with no user payload, navigating to BasicProfileScreen");
            (navigation as any).navigate('BasicProfileScreen');
          }
        } catch {
          // If getCurrentUser fails, navigate to BasicProfileScreen
          console.log("Register success, getCurrentUser failed, navigating to BasicProfileScreen");
          (navigation as any).navigate('BasicProfileScreen');
        }
      }
    } catch (error: any) {
      const fallback = isResetPin ? 'Failed to reset PIN. Please try again.' : 'Registration failed. Please try again.';
      const message = typeof error === 'string' ? error : error?.message;
      showErrorAlert(message || fallback);
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

  const renderPinInputs = (
    pinArray: string[],
    refs: React.MutableRefObject<(TextInput | null)[]>,
    isConfirm = false
  ) => {
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

            <View style={styles.badge}>
              <MaterialCommunityIcons name="form-textbox-password" size={18} color={Colors.primary} />
              <Text style={styles.badgeText}>
                {isResetPin ? (step === 1 ? "New PIN" : "Confirm PIN") : (step === 1 ? "Step 3 of 3" : "Final step")}
              </Text>
            </View>

            <View style={styles.logoWrap}>
              <View style={styles.iconBubble}>
                <Feather name={step === 1 ? "lock" : "check-circle"} size={30} color={Colors.primary} />
              </View>
              <Text style={styles.title}>
                {step === 1 ? 'Create your PIN' : 'Confirm your PIN'}
              </Text>
              <Text style={styles.subtitle}>
                {step === 1
                  ? isResetPin
                    ? 'Create a new secure 4-digit PIN for your account.'
                    : 'Create a secure 4-digit PIN for quick login next time.'
                  : isResetPin
                    ? 'Re-enter the same 4-digit PIN to finish resetting your PIN.'
                    : 'Re-enter the same 4-digit PIN to finish creating your account.'
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
                  style={[
                    styles.continueButton,
                    pin.join('').length !== 4 && styles.disabledActionButton,
                  ]}
                  disabled={pin.join('').length !== 4}
                />
              </View>
            ) : (
              <View style={styles.confirmSection}>
                <Text style={styles.phoneLabel}>{isResetPin ? "Resetting PIN for" : "Creating account for"}</Text>
                <Text style={styles.phoneDisplay}>{phoneNumber}</Text>
                <View style={styles.pinContainer}>
                  {renderPinInputs(confirmPin, confirmPinInputRefs, true)}
                </View>
                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}
                <Button
                  label={loading ? (isResetPin ? "Resetting PIN..." : "Creating Account...") : (isResetPin ? "Reset PIN" : "Create Account")}
                  onPress={() => handleConfirmPin()}
                  style={[
                    styles.createButton,
                    confirmPin.join('').length !== 4 && styles.disabledActionButton,
                  ]}
                  disabled={loading || confirmPin.join('').length !== 4}
                />
              </View>
            )}
          </ScrollView>
        </LinearGradient>
        <Loader visible={loading} message={isResetPin ? "Resetting your PIN..." : "Creating your account..."} />
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
    paddingHorizontal: 20
  },
  pinSection: {
    marginTop: 8,
  },
  confirmSection: {
    marginTop: 8,
  },
  phoneLabel: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 6,
  },
  phoneDisplay: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 18,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
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
  continueButton: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },
  createButton: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },
  disabledActionButton: {
    backgroundColor: "#A9B6D6",
    opacity: 0.7,
  },
  errorText: {
    color: Colors.red,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default CreatePinScreen;
