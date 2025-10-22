import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Colors, heightToDp, widthToDp } from "../../utils";
import MyTextInput from "../../components/MyTextInput";
import Button from "../../components/Button";
import ImagePath from "../../assets/images/ImagePath";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const LoginScreen = () => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const navigation = useNavigation();

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = async () => {
    const pinString = pin.join('');
    if (pinString.length !== 4) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call for PIN verification
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to main app after successful PIN verification
      (navigation as any).navigate('HomeTabs');
    }, 1500);
  };

  const handleRegister = () => {
    (navigation as any).navigate('Register');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <Image source={ImagePath.newLogo} style={styles.logo} />
          <Text style={styles.brandText}>JobPoper</Text>
        </View>
        
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Enter your PIN to continue</Text>

        <View style={styles.pinContainer}>
          {pin.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
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
          ))}
        </View>

        <Button
          label={isLoading ? "Signing In..." : "Sign In"}
          onPress={handleLogin}
          style={{
            ...styles.loginButton,
            backgroundColor: pin.join('').length === 4 ? Colors.primary : Colors.gray,
            opacity: pin.join('').length === 4 ? 1 : 0.6
          }}
          disabled={isLoading || pin.join('').length !== 4}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20 },
  logoWrap: { alignItems: "center", marginVertical: 60 },
  logo: { 
    width: widthToDp(24),
    height: heightToDp(12),
    resizeMode: "contain",
    tintColor: Colors.primary, 
  },
  title: { fontSize: 30, fontWeight: "bold", color: Colors.black, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.gray, marginTop: 6, textAlign: 'center' },
  brandText: {
    marginTop: heightToDp(0),
    color: Colors.primary,
    fontSize: 40,
    fontWeight: "700",
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
  loginButton: {
    borderRadius: 12,
    marginTop: 40,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  registerText: {
    fontSize: 16,
    color: Colors.gray,
  },
  registerLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
