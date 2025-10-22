import React, { useState } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, heightToDp, widthToDp } from "../../utils";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import Button from "../../components/Button";
import ImagePath from "../../assets/images/ImagePath";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const RegisterScreen = () => {
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleContinue = async () => {
    if (!formattedPhone || formattedPhone.length < 10) {
      return;
    }

    if (!agree) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      (navigation as any).navigate('OTP', { phoneNumber: formattedPhone, isNewUser: true });
    }, 1500);
  };

  const handleLogin = () => {
    (navigation as any).navigate('Login');
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
            <Image source={ImagePath.newLogo} style={styles.logo} />
            <Text style={styles.brandText}>JobPoper</Text>
          </View>

          <Text style={styles.title}>Join JobPoper 🚀</Text>
          <Text style={styles.subtitle}>Enter your phone number to get started</Text>

          <PhoneNumberInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            onChangeFormattedText={setFormattedPhone}
            defaultCode="US"
            firstContainerStyle={{ marginTop: 40 }}
          />

          <View style={styles.termsRow}>
            <Checkbox value={agree} onValueChange={setAgree} color={agree ? Colors.primary : undefined} />
            <Text style={styles.termsText}>
              By creating an account, you agree to our
              <Text> </Text>
              <Text style={styles.link}>Terms</Text>
              <Text> and </Text>
              <Text style={styles.link}>Conditions</Text>
            </Text>
          </View>

          <Button
            label={isLoading ? "Sending OTP..." : "Continue"}
            onPress={handleContinue}
            style={{
              ...styles.continueButton,
              backgroundColor: (formattedPhone && formattedPhone.length >= 10 && agree) ? Colors.primary : Colors.gray,
              opacity: (formattedPhone && formattedPhone.length >= 10 && agree) ? 1 : 0.6
            }}
            disabled={isLoading || !formattedPhone || formattedPhone.length < 10 || !agree}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingTop: 12, flex: 1 },
  backBtn: { 
    position: 'absolute', 
    left: 16, 
    top: 12, 
    zIndex: 1 
  },
  logoWrap: { alignItems: "center", marginTop: 40, marginBottom: 30 },
  logo: { 
    width: widthToDp(24),
    height: heightToDp(12),
    resizeMode: "contain",
    tintColor: Colors.primary, 
  },
  brandText: {
    marginTop: heightToDp(1),
    color: Colors.primary,
    fontSize: 40,
    fontWeight: "700",
  },
  title: { fontSize: 30, fontWeight: "bold", color: Colors.black, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.gray, marginTop: 6, textAlign: 'center' },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 24 },
  termsText: { marginLeft: 10, color: Colors.SlateGray, flex: 1, fontSize: 14, lineHeight: 20 },
  link: { color: Colors.primary, fontWeight: '600' },
  continueButton: {
    borderRadius: 12,
    marginTop: 30,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loginText: {
    fontSize: 16,
    color: Colors.gray,
  },
  loginLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
