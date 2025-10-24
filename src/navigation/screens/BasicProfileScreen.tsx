import 'react-native-get-random-values';
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import MyTextInput from "../../components/MyTextInput";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import ImagePath from "../../assets/images/ImagePath";
import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { completeProfile, getCurrentUser } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";

const BasicProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
    fullAddress: ""
  });
  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [agree, setAgree] = useState(false);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day} ${month} ${year}`;
  };

  const handleCompleteProfile = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // if (!agree) {
    //   Alert.alert('Error', 'Please agree to the terms and conditions.');
    //   return;
    // }

    try {
      const profileData = {
        fullName: fullName.trim(),
        email: email.trim(),
        location: location.fullAddress || `${location.city}, ${location.state}, ${location.country}`,
        dateOfBirth: dob ? dob.toISOString().split('T')[0] : undefined,
      };

      const result = await dispatch(completeProfile(profileData)).unwrap();
      
      if (result.status === 'success') {
        // After successful profile completion, get updated user details
        try {
          const userResult = await dispatch(getCurrentUser()).unwrap();
          
          if (userResult.status === 'success' && userResult.data?.user) {
            Alert.alert('Success', 'Profile completed successfully!', [
              {
                text: 'OK',
                onPress: () => (navigation as any).navigate('HomeTabs')
              }
            ]);
          } else {
            Alert.alert('Success', 'Profile completed successfully!', [
              {
                text: 'OK',
                onPress: () => (navigation as any).navigate('HomeTabs')
              }
            ]);
          }
        } catch (userError) {
          // If getCurrentUser fails, still navigate to HomeTabs
          Alert.alert('Success', 'Profile completed successfully!', [
            {
              text: 'OK',
              onPress: () => (navigation as any).navigate('HomeTabs')
            }
          ]);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Profile completion failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <SafeAreaView edges={['top','bottom','left','right']} style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.headerContainer}>
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
        <Text style={styles.title}>Complete Your Profile 👍</Text>
        </View>
<Text style={styles.subtitle}>Finish setting up your profile to start applying!</Text>

        <MyTextInput label="Full Name" placeholder="Enter your full name" value={fullName} onChange={setFullName} firstContainerStyle={{ marginTop: 24 }} />
        <MyTextInput label="Email" placeholder="Enter your email" value={email} onChange={setEmail} keyboardType="email-address" />
        {/* <MyTextInput label="Phone Number" placeholder="Your phone number" value={phone} onChange={setPhone} editable={false} /> */}
        <LocationAutocomplete 
          label="Location" 
          placeholder="Search for your city, state, country" 
          onLocationSelect={(locationData) => setLocation(locationData)}
        />

        <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.8}>
          <View style={styles.inputWrapperRelative}>
            <MyTextInput
              label="Age"
              placeholder="Select date of birth"
              value={dob ? formatDate(dob) : ""}
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

      

        <Button 
          label={loading ? "Completing Profile..." : "Continue"} 
          onPress={handleCompleteProfile}
          disabled={loading}
          style={{ 
            backgroundColor: loading ? Colors.gray : Colors.primary, 
            borderRadius: 12, 
            marginTop: 24 
          }} 
        />
      </ScrollView>
      <Loader visible={loading} message="Completing your profile..." />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { padding: 20, paddingTop: 12 },
  backBtn: { marginRight: 12 },
  logoWrap: { alignItems: "center", marginTop: 40, marginBottom: 24 },
  logo: { width: 80, height: 250, resizeMode: "contain", tintColor: Colors.primary },
  title: { fontSize: 20, fontWeight: "bold", color: Colors.black,  },
  subtitle: { fontSize: 14, color: Colors.gray, marginTop: 6 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 },
  termsText: { marginLeft: 10, color: Colors.SlateGray, flex: 1 },
  link: { color: Colors.primary, fontWeight: '600' },
  inputWrapperRelative: { position: 'relative' },
  trailingIcon: { position: 'absolute', right: 16, bottom: 16 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default BasicProfileScreen;
