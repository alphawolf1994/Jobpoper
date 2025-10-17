import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from "../../utils";
import Header from "../../components/Header";
import MyTextInput from "../../components/MyTextInput";
import Button from "../../components/Button";
import ImagePath from "../../assets/images/ImagePath";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = () => {
  // Profile data state
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 234 567 8900");
  const [country, setCountry] = useState("United States");
  const [stateVal, setStateVal] = useState("New York");
  const [city, setCity] = useState("New York City");
  const [dob, setDob] = useState<Date | null>(new Date(1990, 0, 1));
  const [showPicker, setShowPicker] = useState(false);
  
  // Profile image state
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Request permissions for image picker
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to update your profile picture!');
      return false;
    }
    return true;
  };

  // Handle image picker
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Handle profile update
  const handleUpdateProfile = () => {
    // Here you would typically make an API call to update the profile
    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <SafeAreaView edges={['top','bottom','left','right']} style={{flex: 1}}>
        <Header />
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Profile Settings</Text>
          <Text style={styles.headerSubtitle}>Update your personal information</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <Image source={ImagePath.avatarIcon} style={styles.avatarImage} />
              )}
              
              <TouchableOpacity 
                style={styles.cameraButton} 
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarText}>Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <MyTextInput 
              label="Full Name" 
              placeholder="Enter your full name" 
              value={fullName} 
              onChange={setFullName} 
              firstContainerStyle={{ marginTop: 24 }} 
            />
            
            <MyTextInput 
              label="Email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={setEmail} 
              keyboardType="email-address" 
            />
            
            <MyTextInput 
              label="Phone Number" 
              placeholder="Your phone number" 
              value={phone} 
              onChange={setPhone} 
            />
            
            <MyTextInput 
              label="Country" 
              placeholder="Enter country" 
              value={country} 
              onChange={setCountry} 
            />
            
            <MyTextInput 
              label="State" 
              placeholder="Enter state" 
              value={stateVal} 
              onChange={setStateVal} 
            />
            
            <MyTextInput 
              label="City" 
              placeholder="Enter city" 
              value={city} 
              onChange={setCity} 
            />

            {/* Date of Birth Picker */}
            <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.8}>
              <View style={styles.inputWrapperRelative}>
                <MyTextInput
                  label="Date of Birth"
                  placeholder="Select date of birth"
                  value={dob ? dob.toDateString() : ""}
                  editable={false}
                />
                <Ionicons
                  name="calendar-outline"
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

            {/* Save Button */}
            <Button 
              label="Update Profile" 
              onPress={handleUpdateProfile} 
              style={{ 
                backgroundColor: Colors.primary, 
                borderRadius: 12, 
                marginTop: 32,
                marginBottom: 20
              }} 
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.lightGray,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  avatarText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  formSection: {
    paddingTop: 16,
  },
  inputWrapperRelative: {
    position: 'relative',
  },
  trailingIcon: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

