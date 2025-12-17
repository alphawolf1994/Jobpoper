import { axiosInstance } from "./axiosInstance";

// Get All Notifications API
export const getAllNotificationsApi = async (params?: {
    page?: number;
    limit?: number;
    isRead?: string; // 'true' | 'false'
    sortBy?: string; // 'createdAt' | 'isRead'
    sortOrder?: string; // 'asc' | 'desc'
}) => {
    try {
        const res = await axiosInstance.get("/notifications", {
            params: params || {}
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch notifications");
    }
};

// Get Unread Notifications Count API
export const getUnreadNotificationsCountApi = async () => {
    try {
        const res = await axiosInstance.get("/notifications/unread-count");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch unread count");
    }
};

// Mark Single Notification as Read API
export const markNotificationAsReadApi = async (notificationId: string) => {
    try {
        const res = await axiosInstance.put(`/notifications/${notificationId}/read`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to mark notification as read");
    }
};

// Mark All Notifications as Read API
export const markAllNotificationsAsReadApi = async () => {
    try {
        const res = await axiosInstance.put("/notifications/read-all");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to mark all notifications as read");
    }
};

// Delete Notification API
export const deleteNotificationApi = async (notificationId: string) => {
    try {
        const res = await axiosInstance.delete(`/notifications/${notificationId}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to delete notification");
    }
};

