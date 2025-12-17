import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView, FlatList, AppState, AppStateStatus } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Colors } from "../utils";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import ImagePath from "../assets/images/ImagePath";
import LocationAutocomplete from "./LocationAutocomplete";
import Button from "./Button";
import { RootState, AppDispatch } from "../redux/store";
import { setCurrentLocation } from "../redux/slices/jobSlice";
import { IMAGE_BASE_URL } from "../api/baseURL";
import {
  getAllNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../redux/slices/notificationSlice";
import { Notification } from "../interface/interfaces";
import Toast from "react-native-toast-message";


const Header: React.FC = () => {
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentLocation } = useSelector((state: RootState) => state.job);
  const { notifications, unreadCount, loading } = useSelector((state: RootState) => state.notification);
  
  // Get location from user profile or use default
  const getDefaultLocation = () => {
    if (user?.profile?.location) {
      return user.profile.location;
    }
    return "New York, NY, USA";
  };

  const displayLocation = currentLocation || getDefaultLocation();

  const resolveImageUri = (uri?: string | null) => {
    if (!uri) return null;
    if (uri.startsWith("http") || uri.startsWith("file:")) return uri;
    return `${IMAGE_BASE_URL}${uri.startsWith("/") ? uri : `/${uri}`}`;
  };

  const handleLocationSelect = (locationData: {
    city: string;
    state: string;
    country: string;
    fullAddress: string;
  }) => {
    // Update Redux state with the new location
    dispatch(setCurrentLocation(locationData.fullAddress));
    setIsLocationModalVisible(false);
  };

  const formatLocationDisplay = () => {
    if (displayLocation) {
      const parts = displayLocation.split(',');
      return parts.map(part => part.trim()).join(", ");
    }
    return "New York, NY, USA";
  };

  // Ref to track if component is mounted
  const isMountedRef = useRef(true);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch notifications function - always fetch latest 10 notifications in background
  const fetchNotifications = useCallback(() => {
    if (isMountedRef.current && isAuthenticated) {
      // Fetch both unread count and latest notifications
      dispatch(getUnreadNotificationsCount());
      dispatch(getAllNotifications({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" }));
    }
  }, [dispatch, isAuthenticated]);

  // Fetch unread count on mount and when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  // Set up real-time polling for notifications (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial fetch
    fetchNotifications();

    // Set up polling interval (30 seconds)
    pollingIntervalRef.current = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isAuthenticated, fetchNotifications]);

  // Handle app state changes (foreground/background)
  useEffect(() => {
    if (!isAuthenticated) return;

    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        // App came to foreground, fetch notifications immediately
        fetchNotifications();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, fetchNotifications]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Refresh notifications when modal opens (only if we want to ensure fresh data)
  // But don't show loading - use cached data from Redux
  useEffect(() => {
    if (isNotificationModalVisible && isAuthenticated) {
      // Silently refresh in background without showing loading state
      dispatch(getAllNotifications({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" }));
      dispatch(getUnreadNotificationsCount());
    }
  }, [isNotificationModalVisible, isAuthenticated, dispatch]);

  // Handle notification press
  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      // Mark as read if unread
      if (!notification.isRead) {
        dispatch(markNotificationAsRead(notification._id));
      }

      // Close modal
      setIsNotificationModalVisible(false);

      // Parse navigation identifier
      const [type, id] = notification.navigationIdentifier.split(":");
      if (type === "job" && id) {
        navigation.navigate("JobDetailsScreen", { jobId: id });
      }
    },
    [navigation, dispatch]
  );

  // Handle mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllNotificationsAsRead())
      .then(() => {
        dispatch(getUnreadNotificationsCount());
        Toast.show({
          type: "success",
          text1: "All notifications marked as read",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Failed to mark all as read",
        });
      });
  }, [dispatch]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationDropdownItem, !item.isRead && styles.unreadDropdownItem]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationDropdownContent}>
        <View style={styles.notificationItemHeader}>
          <Text style={styles.notificationItemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {!item.isRead && <View style={styles.unreadDropdownDot} />}
        </View>
        <Text style={styles.notificationDropdownMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationDropdownTime}>{formatDate(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.titleText}>
            JobPoper
          </Text>
          <TouchableOpacity 
            style={styles.locationRow} 
            onPress={() => setIsLocationModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color={Colors.primary}
            />
            <Text style={styles.locationText}>
              {formatLocationDisplay()}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={Colors.gray}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.bellWrapper}
          activeOpacity={0.7}
          onPress={() => setIsNotificationModalVisible(true)}
        >
          <Ionicons name="notifications-outline" size={28} color={Colors.black} />
          {unreadCount > 0 && (
            <View style={styles.redDot}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatar} activeOpacity={0.7}>
          {user?.profile?.profileImage ? (
            <Image source={{ uri: resolveImageUri(user.profile.profileImage) || "" }} style={styles.avatarImage} />
          ) : (
            <Image source={ImagePath.avatarIcon} style={styles.avatarImage} />
          )}
        </TouchableOpacity>
      </View>

      {/* Location Change Modal */}
      <Modal
        visible={isLocationModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsLocationModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setIsLocationModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change Location</Text>
            <View style={styles.placeholder} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Select your preferred location to see relevant job opportunities
            </Text>
            
            <LocationAutocomplete
              label="Search Location"
              placeholder="Enter city, state, or country"
              onLocationSelect={handleLocationSelect}
              firstContainerStyle={{ marginTop: 20 }}
            />
            
            <View style={styles.currentLocationContainer}>
              <Text style={styles.currentLocationLabel}>Current Location:</Text>
              <Text style={styles.currentLocationText}>
                {formatLocationDisplay()}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Notification Dropdown Modal */}
      <Modal
        visible={isNotificationModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsNotificationModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.notificationOverlay}
          activeOpacity={1}
          onPress={() => setIsNotificationModalVisible(false)}
        >
          <View style={styles.notificationDropdownContainer}>
            <View style={styles.notificationDropdown} onStartShouldSetResponder={() => true}>
              <View style={styles.notificationDropdownHeader}>
              <Text style={styles.notificationDropdownTitle}>Notifications</Text>
              <View style={styles.notificationHeaderActions}>
                {unreadCount > 0 && (
                  <TouchableOpacity
                    style={styles.markAllButton}
                    onPress={handleMarkAllAsRead}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.markAllButtonText}>Mark all read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.closeNotificationButton}
                  onPress={() => setIsNotificationModalVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color={Colors.black} />
                </TouchableOpacity>
              </View>
            </View>

            {loading && notifications.length === 0 ? (
              <View style={styles.notificationLoadingContainer}>
                <Text style={styles.notificationLoadingText}>Loading...</Text>
              </View>
            ) : notifications.length === 0 ? (
              <View style={styles.notificationEmptyContainer}>
                <Ionicons name="notifications-off-outline" size={48} color={Colors.gray} />
                <Text style={styles.notificationEmptyText}>No notifications</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item._id}
                style={styles.notificationList}
                contentContainerStyle={styles.notificationListContent}
                showsVerticalScrollIndicator={false}
              />
            )}

            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => {
                setIsNotificationModalVisible(false);
                navigation.navigate("NotificationScreen");
              }}
            >
              <Text style={styles.viewAllButtonText}>View All Notifications</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.primary} />
            </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 80,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: { 
    flexDirection: "row", 
    alignItems: "center",
    flex: 1,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.primary || "#1a1a1a",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
    marginRight: 4,
    fontWeight: "500",
  },
  oInline: {
    backgroundColor: Colors.primary || "#2B8EF6",
    color: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 13,
    overflow: "hidden",
    marginHorizontal: 4,
    fontSize: 14,
    fontWeight: "700",
  },
  actions: { flexDirection: "row", alignItems: "center" },
  bellWrapper: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  redDot: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 18,
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 18,
    resizeMode: "cover",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
  },
  placeholder: {
    width: 32,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 20,
    lineHeight: 22,
  },
  currentLocationContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
  },
  currentLocationLabel: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  currentLocationText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: "500",
  },
  // Notification dropdown styles
  notificationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  notificationDropdownContainer: {
    paddingTop: 80, // Space for header
    paddingHorizontal: 16,
  },
  notificationDropdown: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    maxHeight: 500,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  notificationDropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  notificationDropdownTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.black,
    flex: 1,
  },
  notificationHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  markAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  closeNotificationButton: {
    padding: 4,
  },
  markAllButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  notificationList: {
    maxHeight: 350,
  },
  notificationListContent: {
    paddingVertical: 8,
  },
  notificationDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  unreadDropdownItem: {
    backgroundColor: "#F0F7FF",
  },
  notificationDropdownContent: {
    flex: 1,
  },
  notificationItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationItemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.black,
    flex: 1,
  },
  unreadDropdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  notificationDropdownMessage: {
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationDropdownTime: {
    fontSize: 11,
    color: Colors.gray,
  },
  notificationLoadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  notificationLoadingText: {
    fontSize: 14,
    color: Colors.gray,
  },
  notificationEmptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  notificationEmptyText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 12,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    gap: 8,
  },
  viewAllButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
});