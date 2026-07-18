import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from "expo-clipboard";
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
import { setCurrentLocation, setCurrentLocationCoordinates } from "@/src/redux/slices/jobSlice";
import { deleteAccountApi } from "../../api/authApis";

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
  const [workerIdCopied, setWorkerIdCopied] = useState(false);

  // Copy worker ID to clipboard with brief visual feedback
  const handleCopyWorkerId = async () => {
    if (!user?.workerId) return;
    await Clipboard.setStringAsync(user.workerId);
    setWorkerIdCopied(true);
    setTimeout(() => setWorkerIdCopied(false), 1500);
  };

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
              dispatch(setCurrentLocation(''));
              dispatch(setCurrentLocationCoordinates(null));
            }
          },
        },
      ],
    });
  };

  const handleDeleteAccount = () => {
    showAlert({
      title: "Delete Account",
      message:
        "This will permanently delete your account and all related data. This action cannot be undone. Are you sure you want to continue?",
      type: "warning",
      buttons: [
        {
          label: "Cancel",
          variant: "secondary",
        },
        {
          label: "Delete",
          onPress: async () => {
            try {
              const response = await deleteAccountApi();

              if (response?.status !== "success") {
                throw new Error(response?.message || "Failed to delete account");
              }

              dispatch(clearAuth());
              dispatch(setCurrentLocation(''));
              dispatch(setCurrentLocationCoordinates(null));

              (navigation as any).navigate("LoginScreen");
            } catch (error: any) {
              showAlert({
                title: "Error",
                message: error?.message || "Failed to delete account. Please try again.",
                type: "error",
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

          {user?.isProfessional && (
            <>
              {user?.workerId && (
                <TouchableOpacity
                  style={styles.workerIdBadge}
                  activeOpacity={0.8}
                  onPress={handleCopyWorkerId}
                >
                  <View style={styles.workerIdBadgeLeft}>
                    <View style={styles.workerIdIconWrap}>
                      <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                    </View>
                    <View>
                      <Text style={styles.workerIdBadgeLabel}>Worker ID</Text>
                      <Text style={styles.workerIdBadgeValue}>{user.workerId}</Text>
                    </View>
                  </View>
                  <View style={styles.workerIdCopyWrap}>
                    <Ionicons
                      name={workerIdCopied ? "checkmark-circle" : "copy-outline"}
                      size={18}
                      color={workerIdCopied ? "#10B981" : Colors.primary}
                    />
                    <Text style={[styles.workerIdCopyText, workerIdCopied && { color: "#10B981" }]}>
                      {workerIdCopied ? "Copied" : "Copy"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Ionicons
                    key={s}
                    name={s <= Math.round(user?.rating?.average || 0) ? "star" : "star-outline"}
                    size={16}
                    color="#F59E0B"
                  />
                ))}
                <Text style={styles.ratingText}>
                  {(user?.rating?.average ?? 0).toFixed(1)} · {user?.rating?.count ?? 0} review
                  {(user?.rating?.count ?? 0) !== 1 ? "s" : ""}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewReviewsBtn}
                activeOpacity={0.7}
                onPress={() =>
                  (navigation as any).navigate("WorkerProfileScreen", {
                    workerId: user.id,
                    workerName: user.profile?.fullName,
                    workerImage: user.profile?.profileImage,
                  })
                }
              >
                <Ionicons name="star-outline" size={16} color={Colors.primary} />
                <Text style={styles.viewReviewsText}>View all reviews</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </>
          )}
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
            icon="storefront-outline"
            label="Are you a business?"
            onPress={() => (navigation as any).navigate('BusinessProfilesScreen')}
            iconColor="#14B8A6"
          />

          <MenuItem
            icon="bicycle-outline"
            label="Pickup Service Preference"
            onPress={() => (navigation as any).navigate('VehiclePreferenceScreen')}
            iconColor="#0EA5E9"
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
            label="Verification details"
            onPress={() => (navigation as any).navigate('VerificationDetailsScreen')}
            iconColor="#2563EB"
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
          <MenuItem
            icon="trash-outline"
            label="Delete Account"
            onPress={handleDeleteAccount}
            iconColor="#B91C1C"
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
  workerIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
    minWidth: 220,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  workerIdBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  workerIdIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D1FAE5',
  },
  workerIdBadgeLabel: {
    fontSize: 10,
    color: '#065F46',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  workerIdBadgeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
    letterSpacing: 2,
  },
  workerIdCopyWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 14,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#A7F3D0',
  },
  workerIdCopyText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  ratingText: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '500',
    marginLeft: 4,
  },
  viewReviewsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
  },
  viewReviewsText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
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
