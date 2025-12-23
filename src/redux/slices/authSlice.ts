import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  sendPhoneVerificationApi,
  resendVerificationApi,
  verifyPhoneApi,
  registerUserApi,
  loginUserApi,
  completeProfileApi,
  getCurrentUserApi,
  logoutUserApi,
  changePinApi,
  checkPhoneApi,
  sendForgotPasswordOtpApi,
  verifyForgotPasswordOtpApi,
  resetPinApi
} from "../../api/authApis";
import { setAuthToken } from "../../api/axiosInstance";
import { JobPoperUser, AuthResponse } from "../../interface/interfaces";

interface AuthState {
  user: JobPoperUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  phoneNumber: string | null;
  isPhoneVerified: boolean;
  verificationCode: string | null;
  resetToken: string | null;
  resetPhoneNumber: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: null,
  phoneNumber: null,
  isPhoneVerified: false,
  verificationCode: null,
  resetToken: null,
  resetPhoneNumber: null,
};
// Send phone verification code
export const sendPhoneVerification = createAsyncThunk(
  "auth/sendPhoneVerification",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await sendPhoneVerificationApi(phoneNumber);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to send verification code");
    }
  }
);

// Resend phone verification code
export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await resendVerificationApi(phoneNumber);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to resend verification code");
    }
  }
);

// Check phone number
export const checkPhone = createAsyncThunk(
  "auth/checkPhone",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await checkPhoneApi(phoneNumber);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to check phone number");
    }
  }
);

// Verify phone number
export const verifyPhone = createAsyncThunk(
  "auth/verifyPhone",
  async ({ phoneNumber, verificationCode }: { phoneNumber: string; verificationCode: string }, { rejectWithValue }) => {
    try {
      const response = await verifyPhoneApi(phoneNumber, verificationCode);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Phone verification failed");
    }
  }
);

// Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ phoneNumber, pin }: { phoneNumber: string; pin: string }, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(phoneNumber, pin);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Registration failed");
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phoneNumber, pin }: { phoneNumber: string; pin: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(phoneNumber, pin);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Login failed");
    }
  }
);

// Complete profile
export const completeProfile = createAsyncThunk(
  "auth/completeProfile",
  async (profileData: {
    fullName: string;
    email: string;
    location?: string;
    dateOfBirth?: string;
    profileImage?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await completeProfileApi(profileData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Profile completion failed");
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user data");
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutUserApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Logout failed");
    }
  }
);

// Change PIN
export const changePin = createAsyncThunk(
  "auth/changePin",
  async (newPin: string, { rejectWithValue }) => {
    try {
      const response = await changePinApi(newPin);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to change PIN");
    }
  }
);

// Forgot Password - Send OTP
export const sendForgotPasswordOtp = createAsyncThunk(
  "auth/sendForgotPasswordOtp",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await sendForgotPasswordOtpApi(phoneNumber);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to send OTP");
    }
  }
);

// Forgot Password - Verify OTP
export const verifyForgotPasswordOtp = createAsyncThunk(
  "auth/verifyForgotPasswordOtp",
  async ({ phoneNumber, verificationCode }: { phoneNumber: string; verificationCode: string }, { rejectWithValue }) => {
    try {
      const response = await verifyForgotPasswordOtpApi(phoneNumber, verificationCode);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "OTP verification failed");
    }
  }
);

// Forgot Password - Reset PIN
export const resetPinWithToken = createAsyncThunk(
  "auth/resetPinWithToken",
  async ({ newPin, resetToken }: { newPin: string; resetToken: string }, { rejectWithValue }) => {
    try {
      const response = await resetPinApi(newPin, resetToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to reset PIN");
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setVerificationCode: (state, action: PayloadAction<string>) => {
      state.verificationCode = action.payload;
    },
    setResetPhoneNumber: (state, action: PayloadAction<string>) => {
      state.resetPhoneNumber = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.phoneNumber = null;
      state.isPhoneVerified = false;
      state.verificationCode = null;
      state.error = null;
      state.resetToken = null;
      state.resetPhoneNumber = null;
      setAuthToken(null);
    },
    clearError: (state) => {
      state.error = null;
    },
    clearResetToken: (state) => {
      state.resetToken = null;
      state.resetPhoneNumber = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Phone Verification
      .addCase(sendPhoneVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPhoneVerification.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(sendPhoneVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      // Resend Phone Verification
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(resendVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      // Check Phone
      .addCase(checkPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkPhone.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(checkPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      // Verify Phone
      .addCase(verifyPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(verifyPhone.fulfilled, (state, action) => {
        state.isPhoneVerified = true;
        state.loading = false;
        state.error = null;
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.status === 'success' && response.data) {
          state.user = response.data.user;
          state.accessToken = response.data.token;
          state.isAuthenticated = true;
          setAuthToken(response.data.token);
        }
        state.loading = false;
        state.error = null;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.status === 'success' && response.data) {
          state.user = response.data.user;
          state.accessToken = response.data.token;
          state.isAuthenticated = true;
          setAuthToken(response.data.token);
        }
        state.loading = false;
        state.error = null;
      })
      // Complete Profile
      .addCase(completeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.status === 'success' && response.data) {
          state.user = response.data.user;
        }
        state.loading = false;
        state.error = null;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.status === 'success' && response.data) {
          state.user = response.data.user;
          state.isAuthenticated = true;
        }
        state.loading = false;
        state.error = null;
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.phoneNumber = null;
        state.isPhoneVerified = false;
        state.verificationCode = null;
        state.loading = false;
        state.error = null;
        setAuthToken(null);
      })
      // Change PIN
      .addCase(changePin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePin.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(changePin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      // Forgot Password - Send OTP
      .addCase(sendForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      // Forgot Password - Verify OTP
      .addCase(verifyForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.status === 'success' && response.data) {
          state.resetToken = response.data.resetToken;
        }
        state.loading = false;
        state.error = null;
      })
      // Forgot Password - Reset PIN
      .addCase(resetPinWithToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPinWithToken.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(resetPinWithToken.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.resetToken = null;
        state.resetPhoneNumber = null;
      })
  },
});
// Export the actions
export const { setPhoneNumber, setVerificationCode, setResetPhoneNumber, clearAuth, clearError, clearResetToken } = authSlice.actions;
export default authSlice.reducer;
