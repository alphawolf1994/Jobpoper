import { axiosInstance } from "./axiosInstance";

/**
 * In-app phone verification.
 *
 * Signup no longer sends an OTP. Instead the user verifies their number the
 * first time they take an action that needs a reachable phone (post a task,
 * contact a poster, show interest, add a business profile).
 *
 * Both endpoints are authenticated and always operate on the logged-in user's
 * own phone number — the client never sends a number, so there is no way to
 * verify a number you don't own.
 */

export type PhoneOtpErrorCode =
  | "INVALID_CODE"
  | "CODE_EXPIRED"
  | "OTP_SEND_FAILED"
  | "RATE_LIMITED"
  | "PHONE_NOT_VERIFIED"
  | "NETWORK"
  | "TIMEOUT"
  | "UNKNOWN";

/** Error carrying the machine-readable code so the sheet can render the right copy. */
export class PhoneOtpError extends Error {
  code: PhoneOtpErrorCode;

  constructor(message: string, code: PhoneOtpErrorCode) {
    super(message);
    this.name = "PhoneOtpError";
    this.code = code;
  }
}

/**
 * Map an axios failure onto a { message, code } pair. Network and timeout
 * failures never reach the server, so they get synthesized codes — the sheet
 * treats those as retryable and keeps the primary button enabled.
 */
const toPhoneOtpError = (error: any, fallback: string): PhoneOtpError => {
  if (error?.code === "ECONNABORTED") {
    return new PhoneOtpError(
      "The server took too long to respond. Please try again.",
      "TIMEOUT"
    );
  }

  if (!error?.response) {
    return new PhoneOtpError(
      "No internet connection. Please check your network and try again.",
      "NETWORK"
    );
  }

  const data = error.response.data || {};
  const serverCode = data.code as PhoneOtpErrorCode | undefined;

  // 429 from express-rate-limit already carries code: 'RATE_LIMITED'.
  const code: PhoneOtpErrorCode =
    serverCode || (error.response.status === 429 ? "RATE_LIMITED" : "UNKNOWN");

  return new PhoneOtpError(data.message || fallback, code);
};

export interface SendPhoneOtpResult {
  alreadyVerified: boolean;
  maskedPhone: string;
  resendAfterSeconds: number;
}

/** POST /auth/phone/send-otp — sends a code to the logged-in user's number. */
export const sendMyPhoneOtpApi = async (): Promise<SendPhoneOtpResult> => {
  try {
    const res = await axiosInstance.post("/auth/phone/send-otp");
    const data = res.data?.data || {};

    return {
      alreadyVerified: !!data.alreadyVerified,
      maskedPhone: data.maskedPhone || "",
      resendAfterSeconds:
        typeof data.resendAfterSeconds === "number" ? data.resendAfterSeconds : 60,
    };
  } catch (error: any) {
    throw toPhoneOtpError(error, "Failed to send verification code");
  }
};

/**
 * POST /auth/phone/verify-otp — verifies the code and returns the full,
 * updated user object so the caller can replace auth.user wholesale rather
 * than flipping a boolean and risking drift from the server.
 */
export const verifyMyPhoneOtpApi = async (verificationCode: string) => {
  try {
    const res = await axiosInstance.post("/auth/phone/verify-otp", {
      verificationCode,
    });
    return res.data;
  } catch (error: any) {
    throw toPhoneOtpError(error, "Phone verification failed");
  }
};

/** GET /auth/phone/status — lightweight check. GET /auth/me also carries the flag. */
export const getMyPhoneStatusApi = async () => {
  try {
    const res = await axiosInstance.get("/auth/phone/status");
    return res.data;
  } catch (error: any) {
    throw toPhoneOtpError(error, "Failed to fetch phone verification status");
  }
};
