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

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const getAdminJobsApi = async (limit: number = 100) => {
  try {
    const res = await axiosInstance.get("/admin/jobs", { params: { limit } });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch jobs");
  }
};

export const getAdminJobByIdApi = async (jobId: string) => {
  try {
    const res = await axiosInstance.get(`/admin/jobs/${jobId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch job details");
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
