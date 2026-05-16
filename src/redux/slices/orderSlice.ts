import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  raiseOrderApi,
  getReceivedOrdersApi,
  getUnreadOrdersCountApi,
  markAllOrdersAsReadApi,
  RaiseOrderPayload,
} from "../../api/orderApis";
import { getMyBusinessProfilesApi } from "../../api/businessProfileApis";
import {
  Order,
  ReceivedOrdersResponse,
  UnreadOrdersCountResponse,
} from "../../interface/interfaces";

interface OrderState {
  orders: Order[];
  unreadCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  /**
   * True iff the authenticated user has at least one BusinessProfile in
   * status "approved". The Header uses this to decide whether to show the
   * order-bell icon (business-side feature).
   */
  hasApprovedBusiness: boolean;
  loading: boolean;
  raising: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  unreadCount: 0,
  pagination: null,
  hasApprovedBusiness: false,
  loading: false,
  raising: false,
  error: null,
};

// Raise an order (customer side).
export const raiseOrder = createAsyncThunk(
  "order/raiseOrder",
  async (payload: RaiseOrderPayload, { rejectWithValue }) => {
    try {
      const response = await raiseOrderApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to raise order");
    }
  }
);

// Fetch received orders (business owner side).
export const getReceivedOrders = createAsyncThunk(
  "order/getReceivedOrders",
  async (
    params: { page?: number; limit?: number } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await getReceivedOrdersApi(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch received orders"
      );
    }
  }
);

// Unread orders count (badge).
export const getUnreadOrdersCount = createAsyncThunk(
  "order/getUnreadOrdersCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUnreadOrdersCountApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch unread orders count"
      );
    }
  }
);

// Mark all as read (called when Orders Screen opens).
export const markAllOrdersAsRead = createAsyncThunk(
  "order/markAllOrdersAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await markAllOrdersAsReadApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to mark orders as read"
      );
    }
  }
);

// Cheap check: does the authenticated user have any approved business
// profile? Drives the visibility of the order icon in the header.
export const refreshHasApprovedBusiness = createAsyncThunk(
  "order/refreshHasApprovedBusiness",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyBusinessProfilesApi();
      const profiles = response?.data?.profiles || [];
      const hasApproved = Array.isArray(profiles)
        ? profiles.some((p: any) => p?.status === "approved")
        : false;
      return hasApproved;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to load business profiles"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrders: () => initialState,
    // Bump the badge when an FCM push arrives in the foreground for a new
    // order — the screen will refresh from the server on its next focus,
    // this just keeps the counter snappy.
    incrementUnreadOrders: (state) => {
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // raiseOrder
      .addCase(raiseOrder.pending, (state) => {
        state.raising = true;
        state.error = null;
      })
      .addCase(raiseOrder.fulfilled, (state) => {
        state.raising = false;
        state.error = null;
      })
      .addCase(raiseOrder.rejected, (state, action) => {
        state.raising = false;
        state.error = action.payload as string;
      })
      // getReceivedOrders
      .addCase(getReceivedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceivedOrders.fulfilled, (state, action) => {
        const response = action.payload as ReceivedOrdersResponse;
        if (response.status === "success" && response.data) {
          state.orders = response.data.orders;
          state.unreadCount = response.data.unreadCount;
          state.pagination = response.data.pagination;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(getReceivedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getUnreadOrdersCount
      .addCase(getUnreadOrdersCount.fulfilled, (state, action) => {
        const response = action.payload as UnreadOrdersCountResponse;
        if (response.status === "success" && response.data) {
          state.unreadCount = response.data.unreadCount;
        }
      })
      // markAllOrdersAsRead
      .addCase(markAllOrdersAsRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.orders = state.orders.map((o) => ({ ...o, isRead: true }));
      })
      // refreshHasApprovedBusiness
      .addCase(refreshHasApprovedBusiness.fulfilled, (state, action) => {
        state.hasApprovedBusiness = Boolean(action.payload);
      })
      .addCase(refreshHasApprovedBusiness.rejected, (state) => {
        // On failure we don't clobber the cached value — keep showing the
        // icon if we previously decided to.
      });
  },
});

export const { clearOrderError, resetOrders, incrementUnreadOrders } =
  orderSlice.actions;
export default orderSlice.reducer;
