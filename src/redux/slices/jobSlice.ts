import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
  createJobApi, 
  getAllJobsApi, 
  getJobByIdApi, 
  updateJobApi, 
  deleteJobApi,
  getUserJobsApi,
  getHotJobsApi,
  getListedJobsApi
} from "../../api/jobApis";
import { Job, JobResponse, CreateJobPayload, HotJobsResponse, ListedJobsResponse } from "../../interface/interfaces";

interface JobState {
  jobs: Job[];
  userJobs: Job[];
  hotJobs: Job[];
  listedJobs: Job[];
  currentJob: Job | null;
  loading: boolean;
  error: string | null;
  createJobSuccess: boolean;
  currentLocation: string | null;
}

const initialState: JobState = {
  jobs: [],
  userJobs: [],
  hotJobs: [],
  listedJobs: [],
  currentJob: null,
  loading: false,
  error: null,
  createJobSuccess: false,
  currentLocation: null,
};

// Create Job Async Thunk
export const createJob = createAsyncThunk(
  "job/createJob",
  async (jobData: CreateJobPayload, { rejectWithValue }) => {
    try {
      const response = await createJobApi(jobData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to create job");
    }
  }
);

// Get All Jobs Async Thunk
export const getAllJobs = createAsyncThunk(
  "job/getAllJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllJobsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch jobs");
    }
  }
);

// Get Job By ID Async Thunk
export const getJobById = createAsyncThunk(
  "job/getJobById",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await getJobByIdApi(jobId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch job");
    }
  }
);

// Update Job Async Thunk
export const updateJob = createAsyncThunk(
  "job/updateJob",
  async ({ jobId, jobData }: { jobId: string; jobData: Partial<CreateJobPayload> }, { rejectWithValue }) => {
    try {
      const response = await updateJobApi(jobId, jobData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update job");
    }
  }
);

// Delete Job Async Thunk
export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await deleteJobApi(jobId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete job");
    }
  }
);

// Get User's Jobs Async Thunk
export const getUserJobs = createAsyncThunk(
  "job/getUserJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserJobsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch user jobs");
    }
  }
);

// Get Hot Jobs Async Thunk
export const getHotJobs = createAsyncThunk(
  "job/getHotJobs",
  async ({ location, page = 1, limit = 10, sortOrder = 'desc' }: { 
    location: string; 
    page?: number; 
    limit?: number; 
    sortOrder?: string; 
  }, { rejectWithValue }) => {
    try {
      const response = await getHotJobsApi(location, page, limit, sortOrder);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch hot jobs");
    }
  }
);

// Get Listed Jobs Async Thunk
export const getListedJobs = createAsyncThunk(
  "job/getListedJobs",
  async ({ location, page = 1, limit = 10, sortOrder = 'desc' }: { 
    location: string; 
    page?: number; 
    limit?: number; 
    sortOrder?: string; 
  }, { rejectWithValue }) => {
    try {
      const response = await getListedJobsApi(location, page, limit, sortOrder);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch listed jobs");
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCreateJobSuccess: (state) => {
      state.createJobSuccess = false;
    },
    setCurrentJob: (state, action: PayloadAction<Job | null>) => {
      state.currentJob = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<string>) => {
      state.currentLocation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createJobSuccess = false;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        const response = action.payload as JobResponse;
        if (response.status === 'success' && response.data?.job) {
          state.jobs.unshift(response.data.job);
          state.userJobs.unshift(response.data.job);
          state.createJobSuccess = true;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.createJobSuccess = false;
      })
      // Get All Jobs
      .addCase(getAllJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        const response = action.payload as JobResponse;
        if (response.status === 'success' && response.data?.jobs) {
          state.jobs = response.data.jobs;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Get Job By ID
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        const response = action.payload as JobResponse;
        if (response.status === 'success' && response.data?.job) {
          state.currentJob = response.data.job;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const response = action.payload as JobResponse;
        if (response.status === 'success' && response.data?.job) {
          const updatedJob = response.data.job;
          state.jobs = state.jobs.map(job => 
            job._id === updatedJob._id ? updatedJob : job
          );
          state.userJobs = state.userJobs.map(job => 
            job._id === updatedJob._id ? updatedJob : job
          );
          if (state.currentJob?._id === updatedJob._id) {
            state.currentJob = updatedJob;
          }
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        const response = action.payload as JobResponse;
        if (response.status === 'success') {
          // Remove from jobs array
          state.jobs = state.jobs.filter(job => job._id !== action.meta.arg);
          state.userJobs = state.userJobs.filter(job => job._id !== action.meta.arg);
          if (state.currentJob?._id === action.meta.arg) {
            state.currentJob = null;
          }
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Get User Jobs
      .addCase(getUserJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserJobs.fulfilled, (state, action) => {
        const response = action.payload as JobResponse;
        if (response.status === 'success' && response.data?.jobs) {
          state.userJobs = response.data.jobs;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserJobs.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Get Hot Jobs
      .addCase(getHotJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHotJobs.fulfilled, (state, action) => {
        const response = action.payload as HotJobsResponse;
        if (response.status === 'success' && response.data?.jobs) {
          state.hotJobs = response.data.jobs;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(getHotJobs.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Get Listed Jobs
      .addCase(getListedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListedJobs.fulfilled, (state, action) => {
        const response = action.payload as ListedJobsResponse;
        if (response.status === 'success' && response.data?.jobs) {
          state.listedJobs = response.data.jobs;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(getListedJobs.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { clearError, resetCreateJobSuccess, setCurrentJob, setCurrentLocation } = jobSlice.actions;
export default jobSlice.reducer;
