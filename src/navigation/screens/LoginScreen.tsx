import React, { useState } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { Colors, heightToDp, widthToDp } from "../../utils";
import MyTextInput from "../../components/MyTextInput";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import Button from "../../components/Button";
import ImagePath from "../../assets/images/ImagePath";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <Image source={ImagePath.newLogo} style={styles.logo} />
          <Text style={styles.brandText}>JobPoper</Text>

        </View>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Explore gigs and earn smart!</Text>

        <PhoneNumberInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          onChangeFormattedText={setFormattedPhone}
          defaultCode="US"
          firstContainerStyle={{ marginTop: 24 }}
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
          label="Continue"
          onPress={() => {
            (navigation as any).navigate('OTP');
          }}
          style={{ backgroundColor: Colors.primary, borderRadius: 12, marginTop: 24 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20 },
  logoWrap: { alignItems: "center", marginVertical:100 },
  logo: {  width: widthToDp(24),
    height: heightToDp(12),
    resizeMode: "contain",tintColor: Colors.primary, },
  title: { fontSize: 30, fontWeight: "bold", color: Colors.black },
  subtitle: { fontSize: 14, color: Colors.gray, marginTop: 6 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 },
  termsText: { marginLeft: 10, color: Colors.SlateGray, flex: 1 },
  link: { color: Colors.primary, fontWeight: '600' },
  brandText: {
    marginTop: heightToDp(0),
    color: Colors.primary,
    fontSize: 40,
    fontWeight: "700",
  },
});

export default LoginScreen;
