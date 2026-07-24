import { axiosInstance } from "./axiosInstance";

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getAdminDashboardApi = async () => {
  try {
    const res = await axiosInstance.get("/admin/dashboard");
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard data");
  }
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const getAdminUsersApi = async (limit: number = 100) => {
  try {
    const res = await axiosInstance.get("/admin/users", { params: { limit } });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const getAdminUserByIdApi = async (userId: string) => {
  try {
    const res = await axiosInstance.get(`/admin/users/${userId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user details");
  }
};

export const deleteAdminWorkImageApi = async (userId: string, imagePath: string) => {
  try {
    const res = await axiosInstance.delete(`/admin/users/${userId}/work-images`, {
      data: { imagePath },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete work image");
  }
};

// Block / unblock a user. Backend toggles `isActive` (blocked = !isActive).
export const setUserBlockStatusApi = async (userId: string, blocked: boolean) => {
  try {
    const res = await axiosInstance.patch(`/admin/users/${userId}/block`, { blocked });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update block status");
  }
};

// ─── Reports ──────────────────────────────────────────────────────────────────

export const getAdminReportsApi = async (
  status: "open" | "resolved" | "all" = "open",
  page: number = 1,
  limit: number = 50
) => {
  try {
    const params: Record<string, any> = { page, limit };
    if (status && status !== "all") params.status = status;
    const res = await axiosInstance.get("/admin/reports", { params });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch reports");
  }
};

export const updateReportStatusApi = async (
  reportId: string,
  data: { status: "open" | "resolved"; resolutionNote?: string }
) => {
  try {
    const res = await axiosInstance.patch(`/admin/reports/${reportId}`, data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update report");
  }
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const getAdminJobsApi = async (limit: number = 100) => {
  try {
    const res = await axiosInstance.get("/admin/jobs", { params: { limit } });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch tasks");
  }
};

export const getAdminJobByIdApi = async (jobId: string) => {
  try {
    const res = await axiosInstance.get(`/admin/jobs/${jobId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch task details");
  }
};

// ─── Business Approvals ──────────────────────────────────────────────────────

export const getAdminBusinessApprovalRequestsApi = async (
  limit: number = 100
) => {
  try {
    const res = await axiosInstance.get("/admin/business-profiles/pending", {
      params: { limit },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch business approval requests"
    );
  }
};

// Fetch approved business profiles. The backend reuses the same controller as
// the pending-requests endpoint; the `?status=` query param selects which set
// gets returned. See adminController.getPendingBusinessProfileRequests.
export const getAdminApprovedBusinessProfilesApi = async (
  limit: number = 100
) => {
  try {
    const res = await axiosInstance.get("/admin/business-profiles/pending", {
      params: { limit, status: "approved" },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch approved business profiles"
    );
  }
};

export const reviewBusinessProfileApi = async (
  profileId: string,
  data: { status: "approved" | "rejected"; rejectionReason?: string }
) => {
  try {
    const res = await axiosInstance.put(
      `/admin/business-profiles/${profileId}/review`,
      data
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to review business profile request"
    );
  }
};

// ─── Verifications ────────────────────────────────────────────────────────────

export const getAdminVerificationsApi = async () => {
  try {
    const res = await axiosInstance.get("/admin/verifications");
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch verifications");
  }
};

export const reviewVerificationApi = async (
  userId: string,
  data: { status: "approved" | "rejected"; reviewNotes?: string }
) => {
  try {
    const res = await axiosInstance.put(`/admin/verifications/${userId}/review`, data);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to review verification");
  }
};
