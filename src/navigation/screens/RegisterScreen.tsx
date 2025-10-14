import React, { useState } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import MyTextInput from "../../components/MyTextInput";
import Button from "../../components/Button";
import ImagePath from "../../assets/images/ImagePath";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [agree, setAgree] = useState(false);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <SafeAreaView edges={['top','bottom','left','right']} style={{flex:1}}>
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
        <Text style={styles.title}>Registration 👍</Text>
        <Text style={styles.subtitle}>Let's Register. Apply to jobs!</Text>

        <MyTextInput label="Full Name" placeholder="Enter your full name" value={fullName} onChange={setFullName} firstContainerStyle={{ marginTop: 24 }} />
        <MyTextInput label="Email" placeholder="Enter your email" value={email} onChange={setEmail} keyboardType="email-address" />
        <MyTextInput label="Phone Number" placeholder="Your phone number" value={phone} onChange={setPhone} editable={false} />
        <MyTextInput label="Country" placeholder="Enter country" value={country} onChange={setCountry} />
        <MyTextInput label="State" placeholder="Enter state" value={stateVal} onChange={setStateVal} />
        <MyTextInput label="City" placeholder="Enter city" value={city} onChange={setCity} />

        <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.8}>
          <View style={styles.inputWrapperRelative}>
            <MyTextInput
              label="Age"
              placeholder="Select date of birth"
              value={dob ? dob.toDateString() : ""}
              editable={false}
            />
            <AntDesign
              name="calendar"
              size={20}
              color={Colors.primary}
              style={styles.trailingIcon}
            />
          </View>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            mode="date"
            value={dob ?? new Date(2000, 0, 1)}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            onChange={(_, date) => {
              setShowPicker(false);
              if (date) setDob(date);
            }}
          />
        )}

      

        <Button label="Continue" onPress={() => {navigation.navigate('HomeTabs')}} style={{ backgroundColor: Colors.primary, borderRadius: 12, marginTop: 24 }} />
      </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingTop: 12 },
  backBtn: { position: 'absolute', left: 16, top: 0, zIndex: 1 },
  logoWrap: { alignItems: "center", marginTop: 40, marginBottom: 24 },
  logo: { width: 80, height: 250, resizeMode: "contain", tintColor: Colors.primary },
  title: { fontSize: 30, fontWeight: "bold", color: Colors.black, marginTop: 20 },
  subtitle: { fontSize: 14, color: Colors.gray, marginTop: 6 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 },
  termsText: { marginLeft: 10, color: Colors.SlateGray, flex: 1 },
  link: { color: Colors.primary, fontWeight: '600' },
  inputWrapperRelative: { position: 'relative' },
  trailingIcon: { position: 'absolute', right: 16, bottom: 16 },
});

export default RegisterScreen;
