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
import { resetPinWithToken, clearError, clearResetToken } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

const ResetPinScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state?.auth);
  const loading = authState?.loading || false;
  const error = authState?.error || null;
  const resetToken = authState?.resetToken || null;
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1); // 1 = enter PIN, 2 = confirm PIN

  const pinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);
  const confirmPinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);

  const handlePinChange = (value: string, index: number, isConfirm: boolean = false) => {
    if (value.length > 1) return; // Prevent multiple characters

    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }

    if (isConfirm) {
      const newPin = [...confirmPin];
      newPin[index] = value;
      setConfirmPin(newPin);

      // Auto-focus next input
      if (value && index < 3) {
        confirmPinInputRefs.current[index + 1]?.focus();
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
        setStep(2);
        setTimeout(() => {
          confirmPinInputRefs.current[0]?.focus();
        }, 100);
      }
    }
  };

  const handleKeyPress = (key: string, index: number, isConfirm: boolean = false) => {
    const currentPin = isConfirm ? confirmPin : pin;
    const refs = isConfirm ? confirmPinInputRefs : pinInputRefs;
    
    if (key === 'Backspace' && !currentPin[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleBackToPin = () => {
    setStep(1);
    setConfirmPin(['', '', '', '']);
  };

  const handleResetPin = async () => {
    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');

    if (pinString.length !== 4) {
      showAlert({
        title: "Error",
        message: "Please enter your 4-digit PIN.",
        type: "error",
      });
      return;
    }

    if (confirmPinString.length !== 4) {
      showAlert({
        title: "Error",
        message: "Please confirm your 4-digit PIN.",
        type: "error",
      });
      return;
    }

    if (pinString !== confirmPinString) {
      showAlert({
        title: "Error",
        message: "PINs do not match. Please try again.",
        type: "error",
      });
      setConfirmPin(['', '', '', '']);
      confirmPinInputRefs.current[0]?.focus();
      return;
    }

    if (!resetToken) {
      showAlert({
        title: "Error",
        message: "Reset token not found. Please start the process again.",
        type: "error",
      });
      return;
    }

    try {
      const result = await dispatch(resetPinWithToken({
        newPin: pinString,
        resetToken: resetToken
      })).unwrap();

      if (result.status === 'success') {
        // Clear reset token
        dispatch(clearResetToken());
        
        showAlert({
          title: "Success",
          message: "PIN reset successfully! Please login with your new PIN.",
          type: "success",
          buttons: [
            {
              label: "OK",
              onPress: () => {
                (navigation as any).navigate("LoginScreen");
              },
            },
          ],
        });
      }
    } catch (error: any) {
      showAlert({
        title: "Error",
        message: error || "Failed to reset PIN. Please try again.",
        type: "error",
      });
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setStep(1);
      pinInputRefs.current[0]?.focus();
    }
  };

  const renderPinInputs = (isConfirm: boolean = false) => {
    const currentPin = isConfirm ? confirmPin : pin;
    const refs = isConfirm ? confirmPinInputRefs : pinInputRefs;

    return currentPin.map((digit, index) => (
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
        secureTextEntry
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
            <TouchableOpacity style={styles.backBtn} onPress={handleBackToPin}>
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
            <Text style={styles.emoji}>🔒</Text>
            <Text style={styles.title}>
              {step === 1 ? 'Create New PIN' : 'Confirm New PIN'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? 'Enter your new 4-digit PIN'
                : 'Re-enter your PIN to confirm'
              }
            </Text>
          </View>

          {step === 1 ? (
            <View style={styles.pinSection}>
              <View style={styles.pinContainer}>
                {renderPinInputs(false)}
              </View>
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
            </View>
          ) : (
            <View style={styles.pinSection}>
              <View style={styles.pinContainer}>
                {renderPinInputs(true)}
              </View>
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              <Button
                label={loading ? "Resetting PIN..." : "Reset PIN"}
                onPress={handleResetPin}
                style={{
                  ...styles.resetButton,
                  backgroundColor: confirmPin.join('').length === 4 ? Colors.primary : Colors.gray,
                  opacity: confirmPin.join('').length === 4 ? 1 : 0.6
                }}
                disabled={loading || confirmPin.join('').length !== 4}
              />
            </View>
          )}
        </ScrollView>
        <Loader visible={loading} message="Resetting your PIN..." />
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
  pinSection: {
    marginTop: 0,
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
  resetButton: {
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

export default ResetPinScreen;
