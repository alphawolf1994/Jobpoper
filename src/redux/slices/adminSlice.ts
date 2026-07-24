import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminDashboardApi,
  getAdminUsersApi,
  getAdminUserByIdApi,
  deleteAdminWorkImageApi,
  getAdminJobsApi,
  getAdminJobByIdApi,
  getAdminBusinessApprovalRequestsApi,
  getAdminApprovedBusinessProfilesApi,
  reviewBusinessProfileApi,
  getAdminVerificationsApi,
  reviewVerificationApi,
  setUserBlockStatusApi,
  getAdminReportsApi,
  updateReportStatusApi,
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
  // Professional / worker fields (flat, always present via buildAdminUser)
  isProfessional: boolean;
  workerId?: string | null;
  rating?: { average: number; count: number };
  workImageCount?: number;
  createdAt: string;
  lastLogin?: string;
  // Present only in detail view (getAdminUserById) and verifications list
  profile?: {
    fullName: string;
    email: string;
    location?: string;
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
  // Present only in detail view (getAdminUserById) when isProfessional is true
  professionalProfile?: {
    bio: string;
    yearsOfExperience: number | null;
    serviceCategories: { id: string; name: string; slug: string }[];
    workImages: string[];
  } | null;
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
  postedOnBehalf?: boolean;
  externalContact?: {
    name: string;
    phoneNumber: string;
  } | null;
  createdAt: string;
  // Detail-only fields (buildAdminJobDetail)
  description?: string;
  isActive?: boolean;
  attachments?: string[];
  location?: any;
  updatedAt?: string;
  interestedUsers?: {
    id: string;
    phoneNumber: string;
    fullName: string;   // flat
    notedAt: string;
    proposedPrice?: number | null;
  }[];
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
  workImageDeleteLoading: boolean;
  workImageDeleteError: string | null;

  jobs: AdminJob[];
  selectedJob: AdminJob | null;
  jobsLoading: boolean;
  jobsError: string | null;

  businessApprovalRequests: AdminBusinessApprovalRequest[];
  businessApprovalsLoading: boolean;
  businessApprovalsError: string | null;
  businessReviewLoading: boolean;

  // Approved business profiles (the "Approved" tab on the admin screen). Kept
  // separate from `businessApprovalRequests` so each tab can show its own
  // loading/error state and refresh independently.
  approvedBusinessProfiles: AdminBusinessApprovalRequest[];
  approvedBusinessProfilesLoading: boolean;
  approvedBusinessProfilesError: string | null;

  verifications: AdminUser[];
  verificationsLoading: boolean;
  verificationsError: string | null;
  reviewLoading: boolean;

  blockLoading: boolean;
  blockError: string | null;

  reports: any[];
  reportsLoading: boolean;
  reportsError: string | null;
  reportUpdateLoading: boolean;
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
  workImageDeleteLoading: false,
  workImageDeleteError: null,

  jobs: [],
  selectedJob: null,
  jobsLoading: false,
  jobsError: null,

  businessApprovalRequests: [],
  businessApprovalsLoading: false,
  businessApprovalsError: null,
  businessReviewLoading: false,

  approvedBusinessProfiles: [],
  approvedBusinessProfilesLoading: false,
  approvedBusinessProfilesError: null,

  verifications: [],
  verificationsLoading: false,
  verificationsError: null,
  reviewLoading: false,

  blockLoading: false,
  blockError: null,

  reports: [],
  reportsLoading: false,
  reportsError: null,
  reportUpdateLoading: false,
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

export const deleteAdminWorkImage = createAsyncThunk(
  "admin/deleteWorkImage",
  async (
    { userId, imagePath }: { userId: string; imagePath: string },
    { rejectWithValue }
  ) => {
    try { return await deleteAdminWorkImageApi(userId, imagePath); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to delete work image"); }
  }
);

export const setUserBlockStatus = createAsyncThunk(
  "admin/setUserBlockStatus",
  async (
    { userId, blocked }: { userId: string; blocked: boolean },
    { rejectWithValue }
  ) => {
    try { return await setUserBlockStatusApi(userId, blocked); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to update block status"); }
  }
);

export const fetchAdminReports = createAsyncThunk(
  "admin/fetchReports",
  async (
    { status = "open", page = 1, limit = 50 }: { status?: "open" | "resolved" | "all"; page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try { return await getAdminReportsApi(status, page, limit); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch reports"); }
  }
);

export const updateReportStatus = createAsyncThunk(
  "admin/updateReportStatus",
  async (
    { reportId, status, resolutionNote }: { reportId: string; status: "open" | "resolved"; resolutionNote?: string },
    { rejectWithValue }
  ) => {
    try { return await updateReportStatusApi(reportId, { status, resolutionNote }); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to update report"); }
  }
);

export const fetchAdminJobs = createAsyncThunk(
  "admin/fetchJobs",
  async (limit: number = 100, { rejectWithValue }) => {
    try { return await getAdminJobsApi(limit); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch tasks"); }
  }
);

export const fetchAdminJobById = createAsyncThunk(
  "admin/fetchJobById",
  async (jobId: string, { rejectWithValue }) => {
    try { return await getAdminJobByIdApi(jobId); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch task"); }
  }
);

export const fetchAdminBusinessApprovalRequests = createAsyncThunk(
  "admin/fetchBusinessApprovalRequests",
  async (limit: number = 100, { rejectWithValue }) => {
    try { return await getAdminBusinessApprovalRequestsApi(limit); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch business approval requests"); }
  }
);

export const fetchAdminApprovedBusinessProfiles = createAsyncThunk(
  "admin/fetchApprovedBusinessProfiles",
  async (limit: number = 100, { rejectWithValue }) => {
    try { return await getAdminApprovedBusinessProfilesApi(limit); }
    catch (e: any) { return rejectWithValue(e?.message || "Failed to fetch approved business profiles"); }
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
      state.approvedBusinessProfilesError = null;
      state.verificationsError = null;
      state.workImageDeleteError = null;
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

    // ── Delete work image ─────────────────────────────────────────────────────
    builder
      .addCase(deleteAdminWorkImage.pending, (state) => {
        state.workImageDeleteLoading = true;
        state.workImageDeleteError = null;
      })
      .addCase(deleteAdminWorkImage.fulfilled, (state, action) => {
        state.workImageDeleteLoading = false;
        // Response: { data: { professionalProfile: buildProfessionalProfile() } }
        const updatedProfile = action.payload?.data?.professionalProfile;
        if (state.selectedUser && updatedProfile) {
          state.selectedUser.professionalProfile = updatedProfile;
          state.selectedUser.workImageCount = updatedProfile.workImages?.length ?? 0;
        }
      })
      .addCase(deleteAdminWorkImage.rejected, (state, action) => {
        state.workImageDeleteLoading = false;
        state.workImageDeleteError = action.payload as string;
      });

    // ── Block / unblock user ──────────────────────────────────────────────────
    builder
      .addCase(setUserBlockStatus.pending, (state) => {
        state.blockLoading = true;
        state.blockError = null;
      })
      .addCase(setUserBlockStatus.fulfilled, (state, action) => {
        state.blockLoading = false;
        // Response: { data: { user: { id, isActive, ... } } }
        const updated = action.payload?.data?.user;
        const nextActive =
          typeof updated?.isActive === "boolean" ? updated.isActive : undefined;
        if (state.selectedUser && nextActive !== undefined) {
          state.selectedUser.isActive = nextActive;
        }
        if (updated?.id) {
          const idx = state.users.findIndex((usr) => usr.id === updated.id);
          if (idx !== -1 && nextActive !== undefined) {
            state.users[idx].isActive = nextActive;
          }
        }
      })
      .addCase(setUserBlockStatus.rejected, (state, action) => {
        state.blockLoading = false;
        state.blockError = action.payload as string;
      });

    // ── Reports ───────────────────────────────────────────────────────────────
    builder
      .addCase(fetchAdminReports.pending, (state) => {
        state.reportsLoading = true;
        state.reportsError = null;
      })
      .addCase(fetchAdminReports.fulfilled, (state, action) => {
        state.reportsLoading = false;
        state.reports = action.payload?.data?.reports || [];
      })
      .addCase(fetchAdminReports.rejected, (state, action) => {
        state.reportsLoading = false;
        state.reportsError = action.payload as string;
      })
      .addCase(updateReportStatus.pending, (state) => {
        state.reportUpdateLoading = true;
      })
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        state.reportUpdateLoading = false;
        const updated = action.payload?.data?.report;
        if (updated?._id) {
          const idx = state.reports.findIndex((r: any) => r._id === updated._id);
          if (idx !== -1) state.reports[idx] = { ...state.reports[idx], ...updated };
        }
      })
      .addCase(updateReportStatus.rejected, (state) => {
        state.reportUpdateLoading = false;
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
        const reviewedProfile = action.payload?.data?.profile;
        const reviewedId = reviewedProfile?.id;
        if (reviewedId) {
          // Always pull it out of the pending list (whether it was approved or
          // rejected).
          state.businessApprovalRequests = (
            state.businessApprovalRequests ?? []
          ).filter((p) => p.id !== reviewedId);

          // If it was approved, drop it into the front of the approved list so
          // the Approved tab shows it without a refetch. If the approved list
          // hasn't been loaded yet, leave it empty — the next tab activation
          // will fetch from the server and pick up the change.
          if (
            reviewedProfile?.status === "approved" &&
            state.approvedBusinessProfiles
          ) {
            const alreadyThere = state.approvedBusinessProfiles.some(
              (p) => p.id === reviewedId
            );
            if (!alreadyThere) {
              state.approvedBusinessProfiles = [
                reviewedProfile,
                ...state.approvedBusinessProfiles,
              ];
            }
          }

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

    // ── Approved business profiles ───────────────────────────────────────────
    builder
      .addCase(fetchAdminApprovedBusinessProfiles.pending, (state) => {
        state.approvedBusinessProfilesLoading = true;
        state.approvedBusinessProfilesError = null;
      })
      .addCase(fetchAdminApprovedBusinessProfiles.fulfilled, (state, action) => {
        state.approvedBusinessProfilesLoading = false;
        state.approvedBusinessProfiles =
          action.payload?.data?.requests ?? [];
      })
      .addCase(fetchAdminApprovedBusinessProfiles.rejected, (state, action) => {
        state.approvedBusinessProfilesLoading = false;
        state.approvedBusinessProfilesError = action.payload as string;
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
