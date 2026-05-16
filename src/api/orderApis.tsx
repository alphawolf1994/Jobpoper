import { axiosInstance } from "./axiosInstance";

/**
 * Raise an order against a business profile.
 * Used by the "Raise an Order" modal on the user-side BusinessDetailScreen.
 */
export interface RaiseOrderPayload {
  businessProfileId: string;
  name: string;
  phoneNumber: string;
  location?: string;
  serviceDetail?: string;
}

export const raiseOrderApi = async (data: RaiseOrderPayload) => {
  try {
    const res = await axiosInstance.post("/orders", data);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to raise order"
    );
  }
};

/**
 * Fetch the authenticated business owner's received orders (newest first).
 */
export const getReceivedOrdersApi = async (params?: {
  page?: number;
  limit?: number;
}) => {
  try {
    const res = await axiosInstance.get("/orders/received", {
      params: params || {},
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch orders"
    );
  }
};

/** Unread orders count — backs the badge on the header order icon. */
export const getUnreadOrdersCountApi = async () => {
  try {
    const res = await axiosInstance.get("/orders/unread-count");
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch unread orders count"
    );
  }
};

/**
 * Mark every received order as read. Called when the user opens the
 * Orders Screen — clears the badge per spec.
 */
export const markAllOrdersAsReadApi = async () => {
  try {
    const res = await axiosInstance.put("/orders/read-all");
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Failed to mark orders as read"
    );
  }
};
