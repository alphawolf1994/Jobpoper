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
  Alert 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import Button from "../../components/Button";
import ImagePath from "../../assets/images/ImagePath";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const CreatePinScreen = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = create pin, 2 = confirm pin
  
  const pinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);
  const confirmPinInputRefs = useRef<(TextInput | null)[]>([null, null, null, null]);

  const handlePinChange = (value: string, index: number, isConfirm = false) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    if (isConfirm) {
      const newConfirmPin = [...confirmPin];
      newConfirmPin[index] = value;
      setConfirmPin(newConfirmPin);

      // Auto-focus next input
      if (value && index < 3) {
        confirmPinInputRefs.current[index + 1]?.focus();
      } else if (value && index === 3) {
        // All 4 digits entered, check if pins match
        // Use the updated confirmPin array directly instead of waiting for state update
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
        }, 300);
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

  const handleConfirmPin = (updatedConfirmPin?: string[]) => {
    const pinString = pin.join('');
    // Use the passed updatedConfirmPin if available, otherwise use state
    const currentConfirmPin = updatedConfirmPin || confirmPin;
    const confirmPinString = currentConfirmPin.join('');
    
    if (pinString !== confirmPinString) {
      Alert.alert('Error', 'PIN codes do not match. Please try again.');
      setConfirmPin(['', '', '', '']);
      confirmPinInputRefs.current[0]?.focus();
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to save PIN
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to BasicProfileScreen after PIN creation
      (navigation as any).navigate('BasicProfileScreen');
    }, 2000);
  };

  const handleBackToCreatePin = () => {
    setStep(1);
    setConfirmPin(['', '', '', '']);
  };

  const renderPinInputs = (pinArray: string[], refs: React.RefObject<(TextInput | null)[]>, isConfirm = false) => {
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
                ? 'Choose a 4-digit PIN for secure access to your account'
                : 'Enter your PIN again to confirm'
              }
            </Text>
          </View>

          <View style={styles.pinContainer}>
            {step === 1 
              ? renderPinInputs(pin, pinInputRefs, false)
              : renderPinInputs(confirmPin, confirmPinInputRefs, true)
            }
          </View>

          {step === 2 && (
            <Button 
              label={isLoading ? "Creating Account..." : "Confirm PIN"} 
              onPress={handleConfirmPin}
              style={{
                ...styles.confirmButton,
                backgroundColor: confirmPin.join('').length === 4 ? Colors.primary : Colors.gray,
                opacity: confirmPin.join('').length === 4 ? 1 : 0.6
              }}
              disabled={isLoading || confirmPin.join('').length !== 4}
            />
          )}
        </ScrollView>
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
  confirmButton: {
    marginTop: 40,
    borderRadius: 12,
  },
});

export default CreatePinScreen;
