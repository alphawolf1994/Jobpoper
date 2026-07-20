import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  lookupWorkerApi,
  startJobApi,
  completeJobApi,
  submitReviewApi,
  getWorkerReviewsApi,
} from "../../api/jobApis";
import { WorkerProfile, WorkerReview, ProfessionalProfile } from "../../interface/interfaces";

interface JobVerificationState {
  // Worker lookup
  workerLookupLoading: boolean;
  workerLookupError: string | null;
  lookedUpWorker: WorkerProfile | null;

  // Start job (customer confirms worker)
  startJobLoading: boolean;
  startJobError: string | null;

  // Complete job (worker enters PIN)
  completeJobLoading: boolean;
  completeJobError: string | null;

  // Review
  submitReviewLoading: boolean;
  submitReviewError: string | null;
  reviewSubmitted: boolean;

  // Worker reviews list
  workerReviews: WorkerReview[];
  workerReviewsLoading: boolean;
  workerReviewsError: string | null;
  workerReviewsPagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    hasNextPage: boolean;
  } | null;
  workerReviewsWorkerInfo: {
    _id: string;
    fullName?: string;
    profileImage?: string;
    location?: string;
    workerId?: string | null;
    rating?: { average: number; count: number };
    verification?: { status: string };
    professionalProfile?: ProfessionalProfile;
  } | null;
}

const initialState: JobVerificationState = {
  workerLookupLoading: false,
  workerLookupError: null,
  lookedUpWorker: null,

  startJobLoading: false,
  startJobError: null,

  completeJobLoading: false,
  completeJobError: null,

  submitReviewLoading: false,
  submitReviewError: null,
  reviewSubmitted: false,

  workerReviews: [],
  workerReviewsLoading: false,
  workerReviewsError: null,
  workerReviewsPagination: null,
  workerReviewsWorkerInfo: null,
};

// Lookup worker by Worker ID string
export const lookupWorker = createAsyncThunk(
  "jobVerification/lookupWorker",
  async (workerId: string, { rejectWithValue }) => {
    try {
      return await lookupWorkerApi(workerId);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Worker not found");
    }
  }
);

// Customer confirms worker → status becomes job_started
export const startJob = createAsyncThunk(
  "jobVerification/startJob",
  async ({ jobId, workerId }: { jobId: string; workerId: string }, { rejectWithValue }) => {
    try {
      return await startJobApi(jobId, workerId);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to start task");
    }
  }
);

// Worker enters Task PIN → status becomes completed
export const completeJob = createAsyncThunk(
  "jobVerification/completeJob",
  async ({ jobId, jobPin }: { jobId: string; jobPin: string }, { rejectWithValue }) => {
    try {
      return await completeJobApi(jobId, jobPin);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to complete task");
    }
  }
);

// Customer submits review + rating
export const submitReview = createAsyncThunk(
  "jobVerification/submitReview",
  async (
    { jobId, rating, comment }: { jobId: string; rating: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      return await submitReviewApi(jobId, rating, comment);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to submit review");
    }
  }
);

// Fetch a worker's public reviews
export const getWorkerReviews = createAsyncThunk(
  "jobVerification/getWorkerReviews",
  async (
    { userId, page = 1, limit = 10 }: { userId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      return await getWorkerReviewsApi(userId, page, limit);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch reviews");
    }
  }
);

const jobVerificationSlice = createSlice({
  name: "jobVerification",
  initialState,
  reducers: {
    clearLookedUpWorker(state) {
      state.lookedUpWorker = null;
      state.workerLookupError = null;
    },
    clearVerificationErrors(state) {
      state.workerLookupError = null;
      state.startJobError = null;
      state.completeJobError = null;
      state.submitReviewError = null;
    },
    resetReviewSubmitted(state) {
      state.reviewSubmitted = false;
    },
    clearWorkerReviews(state) {
      state.workerReviews = [];
      state.workerReviewsPagination = null;
      state.workerReviewsWorkerInfo = null;
      state.workerReviewsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lookup worker
      .addCase(lookupWorker.pending, (state) => {
        state.workerLookupLoading = true;
        state.workerLookupError = null;
        state.lookedUpWorker = null;
      })
      .addCase(lookupWorker.fulfilled, (state, action) => {
        state.workerLookupLoading = false;
        const res = action.payload as any;
        if (res?.status === "success" && res?.data?.worker) {
          state.lookedUpWorker = res.data.worker;
        } else {
          state.workerLookupError = "Worker not found";
        }
      })
      .addCase(lookupWorker.rejected, (state, action) => {
        state.workerLookupLoading = false;
        state.workerLookupError = action.payload as string;
      })

      // Start job
      .addCase(startJob.pending, (state) => {
        state.startJobLoading = true;
        state.startJobError = null;
      })
      .addCase(startJob.fulfilled, (state) => {
        state.startJobLoading = false;
      })
      .addCase(startJob.rejected, (state, action) => {
        state.startJobLoading = false;
        state.startJobError = action.payload as string;
      })

      // Complete job
      .addCase(completeJob.pending, (state) => {
        state.completeJobLoading = true;
        state.completeJobError = null;
      })
      .addCase(completeJob.fulfilled, (state) => {
        state.completeJobLoading = false;
      })
      .addCase(completeJob.rejected, (state, action) => {
        state.completeJobLoading = false;
        state.completeJobError = action.payload as string;
      })

      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.submitReviewLoading = true;
        state.submitReviewError = null;
        state.reviewSubmitted = false;
      })
      .addCase(submitReview.fulfilled, (state) => {
        state.submitReviewLoading = false;
        state.reviewSubmitted = true;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitReviewLoading = false;
        state.submitReviewError = action.payload as string;
      })

      // Get worker reviews
      .addCase(getWorkerReviews.pending, (state) => {
        state.workerReviewsLoading = true;
        state.workerReviewsError = null;
      })
      .addCase(getWorkerReviews.fulfilled, (state, action) => {
        state.workerReviewsLoading = false;
        const res = action.payload as any;
        if (res?.status === "success" && res?.data) {
          const incoming = res.data.reviews ?? [];
          const page = res.data.pagination?.currentPage ?? 1;
          // Page 1 replaces the list (fresh load); subsequent pages append (load more)
          state.workerReviews = page > 1 ? [...state.workerReviews, ...incoming] : incoming;
          state.workerReviewsPagination = res.data.pagination ?? null;
          state.workerReviewsWorkerInfo = res.data.worker ?? state.workerReviewsWorkerInfo;
        }
      })
      .addCase(getWorkerReviews.rejected, (state, action) => {
        state.workerReviewsLoading = false;
        state.workerReviewsError = action.payload as string;
      });
  },
});

export const { clearLookedUpWorker, clearVerificationErrors, resetReviewSubmitted, clearWorkerReviews } =
  jobVerificationSlice.actions;
export default jobVerificationSlice.reducer;
