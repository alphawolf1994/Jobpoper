import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationsCount,
} from "../../redux/slices/notificationSlice";
import { Notification } from "../../interface/interfaces";
import Toast from "react-native-toast-message";

const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, pagination, loading, loadingMore, error } = useSelector(
    (state: RootState) => state.notification
  );

  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications on mount and when screen is focused
  useFocusEffect(
    useCallback(() => {
      dispatch(getAllNotifications({ page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" }));
      dispatch(getUnreadNotificationsCount());
    }, [dispatch])
  );

  // Refresh notifications
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(getAllNotifications({ page: 1, limit: 20, sortBy: "createdAt", sortOrder: "desc" }))
      .then(() => {
        dispatch(getUnreadNotificationsCount());
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, [dispatch]);

  // Load more notifications
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && pagination?.hasNextPage) {
      dispatch(
        getAllNotifications({
          page: (pagination.currentPage || 1) + 1,
          limit: 20,
          sortBy: "createdAt",
          sortOrder: "desc",
          append: true,
        })
      );
    }
  }, [dispatch, loadingMore, pagination]);

  // Mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllNotificationsAsRead())
      .then(() => {
        dispatch(getUnreadNotificationsCount());
        Toast.show({
          type: "success",
          text1: "All notifications marked as read",
        });
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Failed to mark all as read",
        });
      });
  }, [dispatch]);

  // Mark single notification as read
  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      dispatch(markNotificationAsRead(notificationId))
        .then(() => {
          dispatch(getUnreadNotificationsCount());
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Failed to mark notification as read",
          });
        });
    },
    [dispatch]
  );

  // Delete notification
  const handleDelete = useCallback(
    (notificationId: string) => {
      Alert.alert("Delete Notification", "Are you sure you want to delete this notification?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteNotification(notificationId))
              .then(() => {
                dispatch(getUnreadNotificationsCount());
                Toast.show({
                  type: "success",
                  text1: "Notification deleted",
                });
              })
              .catch(() => {
                Toast.show({
                  type: "error",
                  text1: "Failed to delete notification",
                });
              });
          },
        },
      ]);
    },
    [dispatch]
  );

  // Handle notification press - navigate based on navigationIdentifier
  const handleNotificationPress = useCallback(
    (notification: Notification) => {
      // Mark as read if unread
      if (!notification.isRead) {
        handleMarkAsRead(notification._id);
      }

      // Parse navigation identifier
      const [type, id] = notification.navigationIdentifier.split(":");
      if (type === "job" && id) {
        navigation.navigate("JobDetailsScreen", { jobId: id });
      }
    },
    [navigation, handleMarkAsRead]
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
  };

  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <View style={styles.notificationFooter}>
          <Text style={styles.notificationTime}>{formatDate(item.createdAt)}</Text>
          <View style={styles.notificationActions}>
            {!item.isRead && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleMarkAsRead(item._id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDelete(item._id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={64} color={Colors.gray} />
      <Text style={styles.emptyText}>No notifications yet</Text>
      <Text style={styles.emptySubtext}>You'll see notifications here when there's activity</Text>
    </View>
  );

  // Render footer (loading indicator)
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top", "bottom", "left", "right"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
    flex: 1,
    marginLeft: 8,
  },
  markAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: "#F0F7FF",
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.gray,
  },
  notificationActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

