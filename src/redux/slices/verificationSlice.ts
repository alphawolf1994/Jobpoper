import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getVerificationStatusApi,
  submitVerificationDocumentsApi,
} from "../../api/authApis";
import { UserVerification } from "../../interface/interfaces";
import { isFreshLocalVerificationUri } from "../../utils/verificationImageUri";
import {
  clearAuth,
  completeProfile,
  getCurrentUser,
  loginUser,
  registerUser,
} from "./authSlice";

type VerificationStatus = UserVerification["status"];

interface VerificationState {
  selfieUri: string | null;
  idPhotoUri: string | null;
  status: VerificationStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNotes: string;
  /** True while fetching verification status from the server. */
  statusLoading: boolean;
  /** True only while submitting selfie + ID documents. */
  submitting: boolean;
  error: string | null;
  promptDismissed: boolean;
}

const initialState: VerificationState = {
  selfieUri: null,
  idPhotoUri: null,
  status: "not_submitted",
  submittedAt: null,
  reviewedAt: null,
  reviewNotes: "",
  statusLoading: false,
  submitting: false,
  error: null,
  promptDismissed: false,
};

/**
 * Apply server verification metadata without wiping freshly-picked local
 * draft images (file://, content://, etc.). Status/notes always sync from
 * the server so approved/under_review still updates correctly.
 */
const applyVerificationState = (
  state: VerificationState,
  verification?: UserVerification | null,
  options?: { forceReplaceImages?: boolean }
) => {
  const nextStatus = verification?.status || "not_submitted";
  const forceReplaceImages = options?.forceReplaceImages === true;

  const keepLocalSelfie =
    !forceReplaceImages && isFreshLocalVerificationUri(state.selfieUri);
  const keepLocalId =
    !forceReplaceImages && isFreshLocalVerificationUri(state.idPhotoUri);

  if (!keepLocalSelfie) {
    state.selfieUri = verification?.selfieImage || null;
  }
  if (!keepLocalId) {
    state.idPhotoUri = verification?.idPhotoImage || null;
  }

  state.status = nextStatus;
  state.submittedAt = verification?.submittedAt || null;
  state.reviewedAt = verification?.reviewedAt || null;
  state.reviewNotes = verification?.reviewNotes || "";

  if (state.status !== "not_submitted") {
    state.promptDismissed = true;
  }
};

export const fetchVerificationStatus = createAsyncThunk(
  "verification/fetchVerificationStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getVerificationStatusApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to fetch verification status"
      );
    }
  }
);

export const submitVerificationDocuments = createAsyncThunk(
  "verification/submitVerificationDocuments",
  async (
    payload: { selfieUri: string; photoIdUri: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await submitVerificationDocumentsApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.message || "Failed to submit verification documents"
      );
    }
  }
);

const verificationSlice = createSlice({
  name: "verification",
  initialState,
  reducers: {
    setSelfieUri: (state, action: PayloadAction<string | null>) => {
      state.selfieUri = action.payload;
      state.error = null;
      if (
        state.status === "approved" ||
        state.status === "under_review"
      ) {
        state.status = "not_submitted";
      }
    },
    setIdPhotoUri: (state, action: PayloadAction<string | null>) => {
      state.idPhotoUri = action.payload;
      state.error = null;
      if (
        state.status === "approved" ||
        state.status === "under_review"
      ) {
        state.status = "not_submitted";
      }
    },
    dismissVerificationPrompt: (state) => {
      state.promptDismissed = true;
    },
    showVerificationPromptAgain: (state) => {
      if (state.status === "not_submitted") {
        state.promptDismissed = false;
      }
    },
    clearVerificationError: (state) => {
      state.error = null;
    },
    resetVerification: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVerificationStatus.pending, (state) => {
        state.statusLoading = true;
        state.error = null;
      })
      .addCase(fetchVerificationStatus.rejected, (state, action) => {
        state.statusLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchVerificationStatus.fulfilled, (state, action) => {
        state.statusLoading = false;
        state.error = null;
        applyVerificationState(state, action.payload?.data?.verification);
      })
      .addCase(submitVerificationDocuments.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitVerificationDocuments.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })
      .addCase(submitVerificationDocuments.fulfilled, (state, action) => {
        state.submitting = false;
        state.error = null;
        // Server now owns the images — replace local drafts with saved paths.
        applyVerificationState(state, action.payload?.data?.verification, {
          forceReplaceImages: true,
        });
        state.promptDismissed = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        applyVerificationState(state, action.payload?.data?.user?.verification);
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        applyVerificationState(state, action.payload?.data?.user?.verification);
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        applyVerificationState(state, action.payload?.data?.user?.verification);
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        applyVerificationState(state, action.payload?.data?.user?.verification);
      })
      .addCase(clearAuth, () => initialState);
  },
});

export const {
  setSelfieUri,
  setIdPhotoUri,
  dismissVerificationPrompt,
  showVerificationPromptAgain,
  clearVerificationError,
  resetVerification,
} = verificationSlice.actions;

export default verificationSlice.reducer;
