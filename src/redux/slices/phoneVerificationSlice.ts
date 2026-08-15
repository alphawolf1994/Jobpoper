import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  PhoneOtpError,
  PhoneOtpErrorCode,
  sendMyPhoneOtpApi,
  verifyMyPhoneOtpApi,
} from "../../api/phoneVerificationApis";
import { clearAuth, logoutUser, markPhoneVerified, setUser } from "./authSlice";

/**
 * Drives the in-app phone verification bottom sheet.
 *
 * NOTE: this slice holds only the transient status of the OTP exchange. The
 * source of truth for "is this user verified" is auth.user.isPhoneVerified,
 * which comes from the server. Never gate an action on this slice.
 */

/** Which action triggered the gate — selects the sheet copy. */
export type GateReason =
  | "post_job"
  | "contact"
  | "show_interest"
  | "business_profile";

export type PhoneVerifyStatus =
  | "idle"
  | "sending"
  | "code_sent"
  | "verifying"
  | "verified"
  | "error";

interface PhoneVerificationState {
  status: PhoneVerifyStatus;
  error: string | null;
  errorCode: PhoneOtpErrorCode | null;
  /**
   * Has a code been sent in this gate session? Drives which view the sheet
   * shows. Deliberately separate from `resendAvailableAt`: an expired code
   * clears the countdown (so Resend is instantly tappable) but must NOT bounce
   * the user back to the "Send code" prompt.
   */
  codeSent: boolean;
  /** Epoch ms. Timestamp-based so backgrounding the app doesn't freeze the countdown. */
  resendAvailableAt: number | null;
  maskedPhone: string | null;
  reason: GateReason | null;
}

const initialState: PhoneVerificationState = {
  status: "idle",
  error: null,
  errorCode: null,
  codeSent: false,
  resendAvailableAt: null,
  maskedPhone: null,
  reason: null,
};

export const sendMyPhoneOtp = createAsyncThunk(
  "phoneVerification/send",
  async (_, { rejectWithValue }) => {
    try {
      return await sendMyPhoneOtpApi();
    } catch (error: any) {
      const err = error as PhoneOtpError;
      return rejectWithValue({
        message: err?.message || "Failed to send verification code",
        code: (err?.code || "UNKNOWN") as PhoneOtpErrorCode,
      });
    }
  }
);

export const verifyMyPhoneOtp = createAsyncThunk(
  "phoneVerification/verify",
  async (verificationCode: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await verifyMyPhoneOtpApi(verificationCode);

      // Push the server's user object straight into auth so every gated screen
      // re-renders as verified. Falls back to flipping the flag if the payload
      // shape ever changes, so the user is never left stuck behind the gate.
      const user = response?.data?.user;
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(markPhoneVerified());
      }

      return response;
    } catch (error: any) {
      const err = error as PhoneOtpError;
      return rejectWithValue({
        message: err?.message || "Phone verification failed",
        code: (err?.code || "UNKNOWN") as PhoneOtpErrorCode,
      });
    }
  }
);

const phoneVerificationSlice = createSlice({
  name: "phoneVerification",
  initialState,
  reducers: {
    /** Called when a gated action is blocked. Resets any stale attempt. */
    openGate: (state, action: PayloadAction<GateReason>) => {
      state.reason = action.payload;
      state.status = "idle";
      state.error = null;
      state.errorCode = null;
      state.codeSent = false;
      state.resendAvailableAt = null;
    },
    /** Full reset — sheet dismissed, verification finished, or user logged out. */
    resetGate: () => initialState,
    /** Clear only the inline error, e.g. as soon as the user edits a digit. */
    clearOtpError: (state) => {
      state.error = null;
      state.errorCode = null;
      // Drop out of the terminal error state so the buttons re-enable.
      if (state.status === "error") {
        state.status = state.codeSent ? "code_sent" : "idle";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Send ──────────────────────────────────────────────────────────────
      .addCase(sendMyPhoneOtp.pending, (state) => {
        state.status = "sending";
        state.error = null;
        state.errorCode = null;
      })
      .addCase(sendMyPhoneOtp.fulfilled, (state, action) => {
        const { alreadyVerified, maskedPhone, resendAfterSeconds } = action.payload;
        state.maskedPhone = maskedPhone || state.maskedPhone;

        if (alreadyVerified) {
          // Server says there was nothing to do — treat as success so the
          // pending action resumes instead of stranding the user in the sheet.
          state.status = "verified";
          return;
        }

        state.status = "code_sent";
        state.codeSent = true;
        state.resendAvailableAt = Date.now() + resendAfterSeconds * 1000;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(sendMyPhoneOtp.rejected, (state, action) => {
        const payload = action.payload as
          | { message: string; code: PhoneOtpErrorCode }
          | undefined;
        state.status = "error";
        state.error = payload?.message || "Failed to send verification code";
        state.errorCode = payload?.code || "UNKNOWN";
      })
      // ── Verify ────────────────────────────────────────────────────────────
      .addCase(verifyMyPhoneOtp.pending, (state) => {
        state.status = "verifying";
        state.error = null;
        state.errorCode = null;
      })
      .addCase(verifyMyPhoneOtp.fulfilled, (state) => {
        state.status = "verified";
        state.error = null;
        state.errorCode = null;
        state.resendAvailableAt = null;
      })
      .addCase(verifyMyPhoneOtp.rejected, (state, action) => {
        const payload = action.payload as
          | { message: string; code: PhoneOtpErrorCode }
          | undefined;
        state.status = "error";
        state.error = payload?.message || "Phone verification failed";
        state.errorCode = payload?.code || "UNKNOWN";

        // An expired code should make Resend immediately available.
        if (payload?.code === "CODE_EXPIRED") {
          state.resendAvailableAt = null;
        }
      })
      // ── Reset on logout ───────────────────────────────────────────────────
      // Without this, a second user signing in on the same device inherits a
      // stale "verified" status from the previous session.
      .addCase(clearAuth, () => initialState)
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const { openGate, resetGate, clearOtpError } =
  phoneVerificationSlice.actions;

export default phoneVerificationSlice.reducer;
