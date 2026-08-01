import { axiosInstance } from "./axiosInstance";

const getApiErrorMessage = (error: any, fallback: string) => {
  const fromBody = error?.response?.data?.message;
  if (fromBody) return fromBody;
  if (error?.code === "ECONNABORTED") {
    return "The server took too long to respond. Please try again.";
  }
  if (error?.message === "Network Error") {
    return "Network error. Please check your connection and try again.";
  }
  return error?.message || fallback;
};

// Attach the machine-readable error code (if any) so the UI can switch on it.
const withCode = (error: any, fallback: string) => {
  const err = new Error(getApiErrorMessage(error, fallback)) as Error & { code?: string };
  err.code = error?.response?.data?.code;
  return err;
};

// GET /referrals/me — own code + total count
export const getReferralSummaryApi = async () => {
  try {
    const res = await axiosInstance.get("/referrals/me");
    return res.data;
  } catch (error: any) {
    throw withCode(error, "Failed to load referral summary");
  }
};

// GET /referrals/my-referrals — paginated referred users (contact masked)
export const getMyReferralsApi = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const res = await axiosInstance.get("/referrals/my-referrals", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.search ? { search: params.search } : {}),
      },
    });
    return res.data;
  } catch (error: any) {
    throw withCode(error, "Failed to load referrals");
  }
};

// GET /referrals/validate/:code — soft pre-check
export const validateReferralCodeApi = async (code: string) => {
  try {
    const res = await axiosInstance.get(
      `/referrals/validate/${encodeURIComponent(code.trim().toUpperCase())}`
    );
    return res.data;
  } catch (error: any) {
    throw withCode(error, "Failed to validate referral code");
  }
};

// GET /admin/users/:userId/referrals — admin list (unmasked)
export const getAdminUserReferralsApi = async (
  userId: string,
  params: { page?: number; limit?: number; search?: string; sort?: string; status?: string } = {}
) => {
  try {
    const res = await axiosInstance.get(`/admin/users/${userId}/referrals`, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 25,
        ...(params.search ? { search: params.search } : {}),
        ...(params.sort ? { sort: params.sort } : {}),
        ...(params.status ? { status: params.status } : {}),
      },
    });
    return res.data;
  } catch (error: any) {
    throw withCode(error, "Failed to load referrals");
  }
};

// Build the URL for the admin PDF export (opened in the system browser).
export const buildAdminReferralExportUrl = (userId: string) =>
  `/admin/users/${userId}/referrals/export`;
