import { axiosInstance } from "./axiosInstance";

// ---------------------------------------------------------------------------
// Forgot-PIN API client
// ---------------------------------------------------------------------------
// These wrap the existing backend endpoints (see jobpoper_backend/routes/auth.js
// and authController.js):
//     POST /auth/forgot-password/send-otp       -> sendForgotPasswordOtp
//     POST /auth/forgot-password/verify-otp     -> verifyForgotPasswordOtp   (returns resetToken)
//     POST /auth/forgot-password/reset-pin      -> resetPin                  (requires Bearer resetToken)
//
// The dev/test fallback code "000000" is implemented inside the backend's
// TwilioService — both when Twilio isn't configured AND when Twilio responds
// with errors 21608/60200/21211/21408 (trial-account / invalid-To). The frontend
// just passes the user-entered code straight through.
// ---------------------------------------------------------------------------

/** Standard backend response envelope. */
type ApiEnvelope<T = any> = {
  status: "success" | "error";
  message?: string;
  data?: T;
};

const extractMessage = (error: any, fallback: string): string => {
  if (error?.code === "ECONNABORTED") {
    return "The server took too long to respond. Check your connection and try again.";
  }
  return error?.response?.data?.message || error?.message || fallback;
};

/**
 * Step 1: ask the backend to send an OTP to the user's phone.
 * Returns the API envelope; throws on failure with a human-readable message.
 */
export const sendForgotPinOtpApi = async (phoneNumber: string): Promise<ApiEnvelope> => {
  try {
    const res = await axiosInstance.post("/auth/forgot-password/send-otp", {
      phoneNumber,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(extractMessage(error, "Failed to send verification code"));
  }
};

/**
 * Step 2: verify the OTP the user entered.
 * On success the backend returns `{ data: { resetToken } }` — a short-lived
 * (10-minute) JWT that the caller must pass to `resetPinApi`.
 */
export const verifyForgotPinOtpApi = async (
  phoneNumber: string,
  verificationCode: string
): Promise<ApiEnvelope<{ resetToken: string }>> => {
  try {
    const res = await axiosInstance.post("/auth/forgot-password/verify-otp", {
      phoneNumber,
      verificationCode,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(extractMessage(error, "OTP verification failed"));
  }
};

/**
 * Step 3: set a new PIN using the reset token from step 2.
 * The backend's resetPin handler reads the token from the Authorization header,
 * so we send it as `Bearer <resetToken>` on this request only (and never store
 * it in the global axios instance — it's single-use and short-lived).
 */
export const resetPinApi = async (
  resetToken: string,
  newPin: string
): Promise<ApiEnvelope> => {
  try {
    const res = await axiosInstance.post(
      "/auth/forgot-password/reset-pin",
      { newPin },
      { headers: { Authorization: `Bearer ${resetToken}` } }
    );
    return res.data;
  } catch (error: any) {
    throw new Error(extractMessage(error, "Failed to reset PIN"));
  }
};
