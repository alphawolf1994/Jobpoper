import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Alert 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { sendPhoneVerification, setPhoneNumber, clearError } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";

const SignupPhoneScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state?.auth);
  const loading = authState?.loading || false;
  const error = authState?.error || null;
  
  const [phoneNumber, setPhoneNumber1] = useState("");
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");

  const handlePhoneSubmit = async () => {
    if (!formattedPhoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number.');
      return;
    }

    // Basic phone number validation for formatted number with country code
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formattedPhoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number with country code.');
      return;
    }

    try {
      // Store phone number in Redux state
      dispatch(setPhoneNumber(formattedPhoneNumber));
      
      // Send verification code
      const result = await dispatch(sendPhoneVerification(formattedPhoneNumber)).unwrap();
      
      if (result.status === 'success') {
        Alert.alert('Code Sent', 'Verification code has been sent to your phone number.', [
          {
            text: 'OK',
            onPress: () => (navigation as any).navigate('PhoneVerificationScreen', { 
              isSignup: true,
              phoneNumber: formattedPhoneNumber 
            })
          }
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send verification code. Please try again.');
    }
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Enter your phone number to get started
            </Text>
          </View>

          <View style={styles.phoneSection}>
            <PhoneNumberInput
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber1(text);
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
              label={loading ? "Sending..." : "Sign Up"} 
              onPress={handlePhoneSubmit}
              style={styles.signupButton}
              disabled={!formattedPhoneNumber.trim() || loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('LoginScreen')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Loader visible={loading} message="Sending verification code..." />
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
  phoneSection: {
    marginTop: 40,
  },
  signupButton: {
    borderRadius: 12,
    marginTop: 20,
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
  loginLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default SignupPhoneScreen;
