import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllNotificationsApi,
  getUnreadNotificationsCountApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  deleteNotificationApi
} from "../../api/notificationApis";
import {
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse
} from "../../interface/interfaces";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotifications: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  pagination: null,
  loading: false,
  loadingMore: false,
  error: null,
};

// Get All Notifications Async Thunk
export const getAllNotifications = createAsyncThunk(
  "notification/getAllNotifications",
  async (params?: {
    page?: number;
    limit?: number;
    isRead?: string;
    sortBy?: string;
    sortOrder?: string;
    append?: boolean;
  }, { rejectWithValue }) => {
    try {
      const { append, ...apiParams } = params || {};
      const response = await getAllNotificationsApi(apiParams);
      return { ...response, append: append || false };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch notifications");
    }
  }
);

// Get Unread Notifications Count Async Thunk
export const getUnreadNotificationsCount = createAsyncThunk(
  "notification/getUnreadNotificationsCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUnreadNotificationsCountApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch unread count");
    }
  }
);

// Mark Single Notification as Read Async Thunk
export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await markNotificationAsReadApi(notificationId);
      return { ...response, notificationId };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to mark notification as read");
    }
  }
);

// Mark All Notifications as Read Async Thunk
export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await markAllNotificationsAsReadApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to mark all notifications as read");
    }
  }
);

// Delete Notification Async Thunk
export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await deleteNotificationApi(notificationId);
      return { ...response, notificationId };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete notification");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Notifications
      .addCase(getAllNotifications.pending, (state, action) => {
        if (action.meta.arg?.append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
          state.notifications = [];
        }
        state.error = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        const response = action.payload as NotificationsResponse & { append: boolean };
        if (response.status === 'success' && response.data) {
          if (response.append) {
            // Append new notifications to existing list
            state.notifications = [...state.notifications, ...response.data.notifications];
          } else {
            // Replace with new notifications (refresh)
            state.notifications = response.data.notifications;
          }
          state.unreadCount = response.data.unreadCount;
          state.pagination = response.data.pagination;
        }
        state.loading = false;
        state.loadingMore = false;
        state.error = null;
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.loadingMore = false;
      })
      // Get Unread Notifications Count
      .addCase(getUnreadNotificationsCount.pending, (state) => {
        state.error = null;
      })
      .addCase(getUnreadNotificationsCount.fulfilled, (state, action) => {
        const response = action.payload as UnreadCountResponse;
        if (response.status === 'success' && response.data) {
          state.unreadCount = response.data.unreadCount;
        }
        state.error = null;
      })
      .addCase(getUnreadNotificationsCount.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Mark Single Notification as Read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const response = action.payload as MarkAsReadResponse & { notificationId: string };
        if (response.status === 'success' && response.data) {
          // Find notification before updating to check if it was unread
          const notification = state.notifications.find(n => n._id === response.notificationId);
          const wasUnread = notification && !notification.isRead;
          
          // Update notification in the list
          state.notifications = state.notifications.map(notification =>
            notification._id === response.notificationId
              ? { ...notification, isRead: true, readAt: response.data?.notification.readAt || new Date().toISOString() }
              : notification
          );
          
          // Decrease unread count if it was unread
          if (wasUnread) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
        state.error = null;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Mark All Notifications as Read
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        const response = action.payload as MarkAllAsReadResponse;
        if (response.status === 'success') {
          // Mark all notifications as read
          state.notifications = state.notifications.map(notification => ({
            ...notification,
            isRead: true,
            readAt: notification.readAt || new Date().toISOString()
          }));
          // Reset unread count
          state.unreadCount = 0;
        }
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete Notification
      .addCase(deleteNotification.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const response = action.payload as { notificationId: string };
        // Remove notification from the list
        const deletedNotification = state.notifications.find(n => n._id === response.notificationId);
        state.notifications = state.notifications.filter(
          notification => notification._id !== response.notificationId
        );
        // Decrease unread count if it was unread
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        // Update pagination
        if (state.pagination) {
          state.pagination.totalNotifications = Math.max(0, state.pagination.totalNotifications - 1);
        }
        state.error = null;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

