import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { sendPhoneVerification, setPhoneNumber, clearError } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useAlertModal } from "../../hooks/useAlertModal";

const SignupPhoneScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state?.auth);
  const loading = authState?.loading || false;
  const error = authState?.error || null;
  const { showAlert, AlertComponent: alertModal } = useAlertModal();
  
  const [phoneNumber, setPhoneNumber1] = useState("");
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState("");

  const handlePhoneSubmit = async () => {
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

    try {
      // Store phone number in Redux state
      dispatch(setPhoneNumber(formattedPhoneNumber));
      
      // Send verification code
      const result = await dispatch(sendPhoneVerification(formattedPhoneNumber)).unwrap();
      
      if (result.status === "success") {
        (navigation as any).navigate("PhoneVerificationScreen", {
          isSignup: true,
          phoneNumber: formattedPhoneNumber,
        });
      }
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to send verification code. Please try again.";
      showAlert({
        title: "Error",
        message: errorMessage,
        type: "error",
      });
    }
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

            <View style={styles.badge}>
              <MaterialCommunityIcons name="account-star-outline" size={18} color={Colors.primary} />
              <Text style={styles.badgeText}>New here?</Text>
            </View>

            <View style={styles.logoWrap}>
              <View style={styles.iconBubble}>
                <Feather name="user-plus" size={30} color={Colors.primary} />
              </View>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>
                Signup is for new users. Start with your phone number, verify it, and continue to create your profile.
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
                label={loading ? "Sending..." : "Create Account"} 
                onPress={handlePhoneSubmit}
                style={[
                  styles.signupButton,
                  (!formattedPhoneNumber.trim() || loading) && styles.disabledActionButton,
                ]}
                disabled={!formattedPhoneNumber.trim() || loading}
              />
            </View>

            <View style={styles.dividerWrap}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              label="Login Instead"
              onPress={() => (navigation as any).navigate('LoginScreen')}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
              icon={<Feather name="log-in" size={18} color={Colors.primary} />}
            />
          </ScrollView>
        </LinearGradient>
        <Loader visible={loading} message="Sending verification code..." />
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
    backgroundColor: "#FFFFFFD6",
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
    marginBottom: 12 
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
  phoneSection: {
    marginTop: 8,
  },
  signupButton: {
    borderRadius: 18,
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },
  disabledActionButton: {
    backgroundColor: "#A9B6D6",
    opacity: 0.7,
  },
  dividerWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D7E0F2",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: "700",
    color: Colors.gray,
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: 0,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#C8D7FF",
    paddingVertical: 15,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
  },
});

export default SignupPhoneScreen;
