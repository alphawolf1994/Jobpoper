import React, { useState, useEffect } from "react";
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
import { IMAGE_BASE_URL } from "../../api/baseURL";
import MyTextInput from "../../components/MyTextInput";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import LocationAutocomplete from "../../components/LocationAutocomplete";
import ImagePath from "../../assets/images/ImagePath";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, completeProfile, logoutUser, clearAuth } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  
  // Profile data state
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
  
  // Profile image state
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFullName(user.profile?.fullName || "");
      setEmail(user.profile?.email || "");
      setPhone(user.phoneNumber || "");
      
      // Parse location from user profile
      if (user.profile?.location) {
        const locationParts = user.profile.location.split(',');
        setLocation({
          city: locationParts[0]?.trim() || "",
          state: locationParts[1]?.trim() || "",
          country: locationParts[2]?.trim() || "",
          fullAddress: user.profile.location
        });
      }
      
      setDob(user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth) : null);
      setProfileImage(user.profile?.profileImage || null);
    } else {
      // Fetch current user data if not available
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

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
  const handleUpdateProfile = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const profileData = {
        fullName: fullName.trim(),
        email: email.trim(),
        location: location.fullAddress || `${location.city}, ${location.state}, ${location.country}`.trim(),
        dateOfBirth: dob ? dob.toISOString().split('T')[0] : undefined,
        profileImage: profileImage || undefined,
      };

      const result = await dispatch(completeProfile(profileData)).unwrap();
      
      if (result.status === 'success') {
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Profile update failed. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Call logout API
              await dispatch(logoutUser()).unwrap();
              
              // Clear auth state
              dispatch(clearAuth());
              
              // Navigate to IntroScreen
              // Note: You might need to use navigation.reset() or similar
              // depending on your navigation setup
              Alert.alert('Success', 'Logged out successfully!');
            } catch (error: any) {
              // Even if API fails, clear local state
              dispatch(clearAuth());
              Alert.alert('Success', 'Logged out successfully!');
            }
          },
        },
      ]
    );
  };

  const resolveImageUri = (uri?: string | null) => {
    if (!uri) return null;
    if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
    return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <SafeAreaView edges={['top','bottom','left','right']} style={{flex: 1}}>
        <Header />
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Profile Settings</Text>
              <Text style={styles.headerSubtitle}>Update your personal information</Text>
            </View>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <Image source={{ uri: resolveImageUri(profileImage) || "" }} style={styles.avatarImage} />
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
              editable={false}
            />
            
            {/* Location input - disabled to show current location */}
            <LocationAutocomplete 
              label="Location" 
              placeholder="Your location" 
              value={location.fullAddress}
              onLocationSelect={(locationData) => setLocation(locationData)}
              firstContainerStyle={{ marginTop: 0 }}
              // disabled={true}
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
              label={loading ? "Updating Profile..." : "Update Profile"} 
              onPress={handleUpdateProfile}
              disabled={loading}
              style={{ 
                backgroundColor: loading ? Colors.gray : Colors.primary, 
                borderRadius: 12, 
                marginTop: 32,
                marginBottom: 20
              }} 
            />
          </View>
        </ScrollView>
        <Loader visible={loading} message="Updating your profile..." />
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
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
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    marginLeft: 16,
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

