import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminDashboardApi,
  getAdminUsersApi,
  getAdminUserByIdApi,
  getAdminJobsApi,
  getAdminJobByIdApi,
  getAdminBusinessApprovalRequestsApi,
  reviewBusinessProfileApi,
  getAdminVerificationsApi,
  reviewVerificationApi,
} from "../../api/adminApis";

// ─── Types matching the ACTUAL API response from buildAdminUser ───────────────
// The backend uses buildAdminUser() which returns FLAT fields (not nested)
export interface AdminUser {
  id: string;              // _id mapped to id by backend
  phoneNumber: string;
  fullName: string;        // flat, from profile.fullName
  email: string;           // flat, from profile.email
  location: string;        // flat, from profile.location
  isProfileComplete: boolean;
  isPhoneVerified: boolean;
  isVerified: boolean;
  verificationStatus: string; // flat: "not_submitted"|"under_review"|"approved"|"rejected"
  isActive: boolean;
  role: "user" | "admin";
  createdAt: string;
  lastLogin?: string;
  // Present only in detail view (getAdminUserById) and verifications list
  profile?: {
    fullName: string;
    email: string;
    location?: string;
    dateOfBirth?: string;
    profileImage?: string;
    isProfileComplete: boolean;
  };
  verification?: {
    selfieImage?: string | null;
    idPhotoImage?: string | null;
    status: string;
    submittedAt?: string | null;
    reviewedAt?: string | null;
    reviewNotes?: string;
  };
}

// The backend uses buildAdminJob() which also returns flat fields
export interface AdminJob {
  id: string;             // _id mapped to id by backend
  title: string;
  urgency: "Urgent" | "Normal";
  status: "open" | "in-progress" | "completed" | "cancelled";
  jobType?: "OnSite" | "Pickup";
  responsePreference?: string;
  cost: string;
  scheduledDate: string;
  scheduledTime: string;
  postedBy: {
    id: string;
    phoneNumber: string;
    fullName: string;     // flat, from profile.fullName
  };
  category?: {
    id: string;
    name: string;
    slug: string;
    icon?: string;
  } | null;
  interestedCount: number;
  createdAt: string;
  // Detail-only fields (buildAdminJobDetail)
  description?: string;
  isActive?: boolean;
  attachments?: string[];
  location?: any;
  updatedAt?: string;
  interestedUsers?: Array<{
    id: string;
    phoneNumber: string;
    fullName: string;   // flat
    notedAt: string;
  }>;
}

export interface AdminBusinessApprovalRequest {
  id: string;
  businessName: string;
  category?: { id: string; name: string; slug: string } | string | null;
  address?: string;
  phoneNumber?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: string | null;
    phoneNumber: string;
    fullName: string;
  };
  images?: {
    id: string;
    url: string;
    isPrimary?: boolean;
    uploadedAt?: string | null;
  }[];
}

export interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  activeJobs: number;
  verifiedUsers: number;
  pendingVerifications: number;
  pendingBusinessApprovals: number;
}

interface AdminState {
  dashboardStats: DashboardStats | null;
  recentUsers: AdminUser[];
  recentJobs: AdminJob[];
  dashboardLoading: boolean;
  dashboardError: string | null;

  users: AdminUser[];
  selectedUser: AdminUser | null;
  usersLoading: boolean;
  usersError: string | null;

  jobs: AdminJob[];
  selectedJob: AdminJob | null;
  jobsLoading: boolean;
  jobsError: string | null;

  businessApprovalRequests: AdminBusinessApprovalRequest[];
  businessApprovalsLoading: boolean;
  businessApprovalsError: string | null;
  businessReviewLoading: boolean;

  verifications: AdminUser[];
  verificationsLoading: boolean;
  verificationsError: string | null;
  reviewLoading: boolean;
}

const initialState: AdminState = {
  dashboardStats: null,
  recentUsers: [],
  recentJobs: [],
  dashboardLoading: false,
  dashboardError: null,

  users: [],
  selectedUser: null,
  usersLoading: false,
  usersError: null,

  jobs: [],
  selectedJob: null,
  jobsLoading: false,
  jobsError: null,

  businessApprovalRequests: [],
  businessApprovalsLoading: false,
  businessApprovalsError: null,
  businessReviewLoading: false,

  verifications: [],
  verificationsLoading: false,
  verificationsError: null,
  reviewLoading: false,
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try { return await getAdminDashboardApi(); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch dashboard"); }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (limit: number = 100, { rejectWithValue }) => {
    try { return await getAdminUsersApi(limit); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch users"); }
  }
);

export const fetchAdminUserById = createAsyncThunk(
  "admin/fetchUserById",
  async (userId: string, { rejectWithValue }) => {
    try { return await getAdminUserByIdApi(userId); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch user"); }
  }
);

export const fetchAdminJobs = createAsyncThunk(
  "admin/fetchJobs",
  async (limit: number = 100, { rejectWithValue }) => {
    try { return await getAdminJobsApi(limit); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch jobs"); }
  }
);

export const fetchAdminJobById = createAsyncThunk(
  "admin/fetchJobById",
  async (jobId: string, { rejectWithValue }) => {
    try { return await getAdminJobByIdApi(jobId); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch job"); }
  }
);

export const fetchAdminBusinessApprovalRequests = createAsyncThunk(
  "admin/fetchBusinessApprovalRequests",
  async (limit: number = 100, { rejectWithValue }) => {
    try { return await getAdminBusinessApprovalRequestsApi(limit); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch business approval requests"); }
  }
);

export const reviewBusinessProfile = createAsyncThunk(
  "admin/reviewBusinessProfile",
  async (
    {
      profileId,
      status,
      rejectionReason,
    }: {
      profileId: string;
      status: "approved" | "rejected";
      rejectionReason?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await reviewBusinessProfileApi(profileId, {
        status,
        rejectionReason,
      });
    } catch (e: any) {
      return rejectWithValue(
        e?.message || "Failed to review business profile request"
      );
    }
  }
);

export const fetchAdminVerifications = createAsyncThunk(
  "admin/fetchVerifications",
  async (_, { rejectWithValue }) => {
    try { return await getAdminVerificationsApi(); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch verifications"); }
  }
);

export const reviewVerification = createAsyncThunk(
  "admin/reviewVerification",
  async (
    { userId, status, reviewNotes }: { userId: string; status: "approved" | "rejected"; reviewNotes?: string },
    { rejectWithValue }
  ) => {
    try { return await reviewVerificationApi(userId, { status, reviewNotes }); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to review verification"); }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminErrors: (state) => {
      state.dashboardError = null;
      state.usersError = null;
      state.jobsError = null;
      state.businessApprovalsError = null;
      state.verificationsError = null;
    },
    clearSelectedUser: (state) => { state.selectedUser = null; },
    clearSelectedJob:  (state) => { state.selectedJob = null; },
  },
  extraReducers: (builder) => {
    // ── Dashboard ──────────────────────────────────────────────────────────────
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        // Response shape: { status, data: { stats: {...}, recentUsers: [], recentJobs: [] } }
        const data = action.payload?.data;
        if (data) {
          const s = data.stats ?? {};
          state.dashboardStats = {
            totalUsers:           s.totalUsers               ?? 0,
            totalJobs:            s.totalJobs                ?? 0,
            activeJobs:           s.activeJobs               ?? 0,
            verifiedUsers:        s.verifiedUsers            ?? 0,
            pendingVerifications: s.pendingVerificationRequests ?? 0,
            pendingBusinessApprovals: s.pendingBusinessApprovalRequests ?? 0,
          };
          state.recentUsers = data.recentUsers ?? [];
          state.recentJobs  = data.recentJobs  ?? [];
        }
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload as string;
      });

    // ── Users list ─────────────────────────────────────────────────────────────
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        // Response: { data: { users: [...buildAdminUser()] } }
        state.users = action.payload?.data?.users ?? [];
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload as string;
      });

    // ── User by ID ─────────────────────────────────────────────────────────────
    builder
      .addCase(fetchAdminUserById.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAdminUserById.fulfilled, (state, action) => {
        state.usersLoading = false;
        // Response: { data: { user: { ...buildAdminUser(), profile, verification } } }
        state.selectedUser = action.payload?.data?.user ?? null;
      })
      .addCase(fetchAdminUserById.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload as string;
      });

    // ── Jobs list ──────────────────────────────────────────────────────────────
    builder
      .addCase(fetchAdminJobs.pending, (state) => {
        state.jobsLoading = true;
        state.jobsError = null;
      })
      .addCase(fetchAdminJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;
        // Response: { data: { jobs: [...buildAdminJob()] } }
        state.jobs = action.payload?.data?.jobs ?? [];
      })
      .addCase(fetchAdminJobs.rejected, (state, action) => {
        state.jobsLoading = false;
        state.jobsError = action.payload as string;
      });

    // ── Job by ID ──────────────────────────────────────────────────────────────
    builder
      .addCase(fetchAdminJobById.pending, (state) => {
        state.jobsLoading = true;
        state.jobsError = null;
      })
      .addCase(fetchAdminJobById.fulfilled, (state, action) => {
        state.jobsLoading = false;
        // Response: { data: { job: buildAdminJobDetail() } }
        state.selectedJob = action.payload?.data?.job ?? null;
      })
      .addCase(fetchAdminJobById.rejected, (state, action) => {
        state.jobsLoading = false;
        state.jobsError = action.payload as string;
      });

    // ── Business approval requests ───────────────────────────────────────────
    builder
      .addCase(fetchAdminBusinessApprovalRequests.pending, (state) => {
        state.businessApprovalsLoading = true;
        state.businessApprovalsError = null;
      })
      .addCase(fetchAdminBusinessApprovalRequests.fulfilled, (state, action) => {
        state.businessApprovalsLoading = false;
        state.businessApprovalRequests =
          action.payload?.data?.requests ?? [];
      })
      .addCase(fetchAdminBusinessApprovalRequests.rejected, (state, action) => {
        state.businessApprovalsLoading = false;
        state.businessApprovalsError = action.payload as string;
      })
      .addCase(reviewBusinessProfile.pending, (state) => {
        state.businessReviewLoading = true;
        state.businessApprovalsError = null;
      })
      .addCase(reviewBusinessProfile.fulfilled, (state, action) => {
        state.businessReviewLoading = false;
        const reviewedId = action.payload?.data?.profile?.id;
        if (reviewedId) {
          state.businessApprovalRequests = (
            state.businessApprovalRequests ?? []
          ).filter((p) => p.id !== reviewedId);
          if (state.dashboardStats?.pendingBusinessApprovals) {
            state.dashboardStats.pendingBusinessApprovals = Math.max(
              0,
              state.dashboardStats.pendingBusinessApprovals - 1
            );
          }
        }
      })
      .addCase(reviewBusinessProfile.rejected, (state, action) => {
        state.businessReviewLoading = false;
        state.businessApprovalsError = action.payload as string;
      });

    // ── Verifications list ─────────────────────────────────────────────────────
    builder
      .addCase(fetchAdminVerifications.pending, (state) => {
        state.verificationsLoading = true;
        state.verificationsError = null;
      })
      .addCase(fetchAdminVerifications.fulfilled, (state, action) => {
        state.verificationsLoading = false;
        // Response: { data: { requests: [...{ ...buildAdminUser(), verification }] } }
        state.verifications = action.payload?.data?.requests ?? [];
      })
      .addCase(fetchAdminVerifications.rejected, (state, action) => {
        state.verificationsLoading = false;
        state.verificationsError = action.payload as string;
      });

    // ── Review Verification ────────────────────────────────────────────────────
    builder
      .addCase(reviewVerification.pending, (state) => {
        state.reviewLoading = true;
      })
      .addCase(reviewVerification.fulfilled, (state, action) => {
        state.reviewLoading = false;
        const updatedUser = action.payload?.data?.user;
        if (updatedUser) {
          const idx = state.verifications.findIndex((v) => v.id === updatedUser.id);
          if (idx !== -1) state.verifications[idx] = updatedUser;
        }
      })
      .addCase(reviewVerification.rejected, (state, action) => {
        state.reviewLoading = false;
        state.verificationsError = action.payload as string;
      });
  },
});

export const { clearAdminErrors, clearSelectedUser, clearSelectedJob } = adminSlice.actions;
export default adminSlice.reducer;
