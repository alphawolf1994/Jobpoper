import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "../../utils";
import Header from "../../components/Header";
import { IMAGE_BASE_URL } from "../../api/baseURL";
import ImagePath from "../../assets/images/ImagePath";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, clearAuth } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { useAlertModal } from "../../hooks/useAlertModal";
import { setCurrentLocation } from "@/src/redux/slices/jobSlice";

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  iconColor?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, iconColor }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuItemLeft}>
      <View style={[styles.iconContainer, iconColor && { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon as any} size={24} color={iconColor || Colors.primary} />
      </View>
      <Text style={styles.menuItemText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { showAlert, AlertComponent: alertModal } = useAlertModal();

  // Handle logout
  const handleLogout = () => {
    showAlert({
      title: "Logout",
      message: "Are you sure you want to logout?",
      type: "warning",
      buttons: [
        {
          label: "Cancel",
          variant: "secondary",
        },
        {
          label: "Logout",
          onPress: async () => {
            try {
              await dispatch(logoutUser()).unwrap();
            } finally {
              dispatch(clearAuth());
              dispatch(setCurrentLocation(''))
              showAlert({
                title: "Success",
                message: "Logged out successfully!",
                type: "success",
              });
            }
          },
        },
      ],
    });
  };

  const resolveImageUri = (uri?: string | null) => {
    if (!uri) return null;
    if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
    return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
  };

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={styles.container}>
      <Header />

      {/* Header with Settings Icon */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Profile</Text>
        {/* <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={24} color={Colors.black} />
        </TouchableOpacity> */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.profile?.profileImage ? (
              <Image
                source={{ uri: resolveImageUri(user.profile.profileImage) || "" }}
                style={styles.avatarImage}
              />
            ) : (
              <Image source={ImagePath.avatarIcon} style={styles.avatarImage} />
            )}
          </View>
          <Text style={styles.userName}>{user?.profile?.fullName || "User Name"}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="person-outline"
            label="User details"
            onPress={() => (navigation as any).navigate('UserDetailsScreen')}
            iconColor="#F59E0B"
          />

          <MenuItem
            icon="key-outline"
            label="Security PIN"
            onPress={() => (navigation as any).navigate('ChangePinScreen')}
            iconColor="#3B82F6"
          />

          <MenuItem
            icon="location-outline"
            label="Manage Location"
            onPress={() => (navigation as any).navigate('ManageLocationsScreen')}
            iconColor="#10B981"
          />

          <MenuItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => (navigation as any).navigate('PrivacyPolicyScreen')}
            iconColor="#8B5CF6"
          />

          <MenuItem
            icon="document-text-outline"
            label="Terms & Conditions"
            onPress={() => (navigation as any).navigate('TermsAndConditionsScreen')}
            iconColor="#6366F1"
          />

          <MenuItem
            icon="log-out-outline"
            label="Logout"
            onPress={handleLogout}
            iconColor="#EF4444"
          />
        </View>
      </ScrollView>

      {alertModal}
    </SafeAreaView>
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
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: Colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginTop: 8,
  },
  menuSection: {
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
});
