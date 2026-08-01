import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getReferralSummaryApi,
  getMyReferralsApi,
  validateReferralCodeApi,
} from "../../api/referralApis";
import { ReferredUser } from "../../interface/interfaces";

interface ReferralState {
  referralCode: string | null;
  totalReferrals: number;
  referrals: ReferredUser[];
  page: number;
  hasMore: boolean;
  loading: boolean; // first load / refresh
  loadingMore: boolean; // pagination
  error: string | null;
}

const initialState: ReferralState = {
  referralCode: null,
  totalReferrals: 0,
  referrals: [],
  page: 1,
  hasMore: false,
  loading: false,
  loadingMore: false,
  error: null,
};

export const fetchReferralSummary = createAsyncThunk(
  "referral/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await getReferralSummaryApi();
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to load referral summary");
    }
  }
);

export const fetchMyReferrals = createAsyncThunk(
  "referral/fetchMyReferrals",
  async (
    params: { page?: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await getMyReferralsApi(params);
      return { ...res, requestedPage: params.page ?? 1 };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to load referrals");
    }
  }
);

export const validateReferralCode = createAsyncThunk(
  "referral/validate",
  async (code: string, { rejectWithValue }) => {
    try {
      return await validateReferralCodeApi(code);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to validate referral code");
    }
  }
);

const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    clearReferrals: (state) => {
      state.referrals = [];
      state.page = 1;
      state.hasMore = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchReferralSummary.fulfilled, (state, action) => {
        const data = action.payload?.data;
        if (data) {
          state.referralCode = data.referralCode ?? state.referralCode;
          state.totalReferrals = data.totalReferrals ?? 0;
        }
      })
      // List
      .addCase(fetchMyReferrals.pending, (state, action) => {
        const page = action.meta.arg.page ?? 1;
        if (page === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchMyReferrals.fulfilled, (state, action) => {
        const data = action.payload?.data;
        const requestedPage = action.payload?.requestedPage ?? 1;
        if (data) {
          state.referrals =
            requestedPage === 1
              ? data.referrals
              : [...state.referrals, ...data.referrals];
          state.page = data.page ?? requestedPage;
          state.hasMore = !!data.hasMore;
          state.totalReferrals = data.total ?? state.totalReferrals;
        }
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(fetchMyReferrals.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = (action.payload as string) || "Failed to load referrals";
      });
  },
});

export const { clearReferrals } = referralSlice.actions;
export default referralSlice.reducer;
