import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
  createJobApi, 
  getAllJobsApi, 
  getJobByIdApi, 
  updateJobApi, 
  deleteJobApi,
  getUserJobsApi,
  getHotJobsApi,
  getListedJobsApi,
  getMyInterestedJobsApi,
  updateJobStatusApi,
  expireOldJobsApi,
  searchHotJobsApi,
  searchListedJobsApi
} from "../../api/jobApis";
import { Job, JobResponse, CreateJobPayload, HotJobsResponse, ListedJobsResponse } from "../../interface/interfaces";
import { geocodeAddressToCoordinates } from "../../utils/geocode";
import { RootState } from "../store";

interface JobState {
  jobs: Job[];
  userJobs: Job[];
  interestedJobs: Job[];
  interestedJobsPagination: {
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  hotJobs: Job[];
  listedJobs: Job[];
  allHotJobs: Job[];
  allHotJobsPagination: {
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  allListedJobs: Job[];
  allListedJobsPagination: {
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  currentJob: Job | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  createJobSuccess: boolean;
  currentLocation: string | null;
  currentLocationCoordinates: { latitude: number; longitude: number } | null;
  // Where the active location came from. 'manual' must not be silently
  // overwritten by auto-detection within a session.
  locationSource: "auto" | "manual" | "profile" | "default" | null;
  // True while the device GPS location is being detected.
  isDetectingLocation: boolean;
  // Foreground location permission status as last seen by the app.
  locationPermissionStatus: "unknown" | "granted" | "denied";
}

export interface SetDetectedLocationPayload {
  fullAddress: string;
  latitude: number;
  longitude: number;
  source: "auto" | "manual" | "profile" | "default";
}

async function resolveCoordinates(state: RootState): Promise<{ latitude: number; longitude: number }> {
  const coords = state.job.currentLocationCoordinates;
  if (coords) return coords;
  const profileCurrentLocation = state.auth?.user?.profile?.currentLocation;
  if (
    profileCurrentLocation?.latitude != null &&
    profileCurrentLocation?.longitude != null
  ) {
    return {
      latitude: profileCurrentLocation.latitude,
      longitude: profileCurrentLocation.longitude,
    };
  }
  const locationString =
    state.job.currentLocation ||
    profileCurrentLocation?.fullAddress ||
    state.auth?.user?.profile?.location ||
    "New York, NY, USA";
  const geocoded = await geocodeAddressToCoordinates(locationString);
  if (geocoded) return geocoded;
  throw new Error("Could not resolve location; try selecting a place from the search");
}

const initialState: JobState = {
  jobs: [],
  userJobs: [],
  interestedJobs: [],
  interestedJobsPagination: null,
  hotJobs: [],
  listedJobs: [],
  allHotJobs: [],
  allHotJobsPagination: null,
  allListedJobs: [],
  allListedJobsPagination: null,
  currentJob: null,
  loading: false,
  loadingMore: false,
  error: null,
  createJobSuccess: false,
  currentLocation: null,
  currentLocationCoordinates: null,
  locationSource: null,
  isDetectingLocation: false,
  locationPermissionStatus: "unknown",
};

// Create Job Async Thunk
export const createJob = createAsyncThunk(
  "job/createJob",
  async (jobData: CreateJobPayload, { rejectWithValue }) => {
    try {
      const response = await createJobApi(jobData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to create task");
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
      return rejectWithValue(error?.message || "Failed to fetch tasks");
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
      return rejectWithValue(error?.message || "Failed to fetch task");
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
      console.log("Error in updateJob thunk:", error);
      return rejectWithValue(error?.message || error?.Error || "Failed to update task");
    }
  }
);

// Delete Task Async Thunk
export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await deleteJobApi(jobId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to delete task");
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
      return rejectWithValue(error?.message || "Failed to fetch user tasks");
    }
  }
);

// Get Hot Tasks Async Thunk
export const getHotJobs = createAsyncThunk(
  "job/getHotJobs",
  async ({ location, page = 1, limit = 10, sortOrder = 'desc', category }: {
    location: string;
    page?: number;
    limit?: number;
    sortOrder?: string;
    category?: string | null;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = await resolveCoordinates(state);
      const response = await getHotJobsApi(latitude, longitude, page, limit, sortOrder, category ?? null);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch hot tasks");
    }
  }
);

// Get Listed Tasks Async Thunk
export const getListedJobs = createAsyncThunk(
  "job/getListedJobs",
  async ({ location, page = 1, limit = 10, sortOrder = 'desc', category }: {
    location: string;
    page?: number;
    limit?: number;
    sortOrder?: string;
    category?: string | null;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = await resolveCoordinates(state);
      const response = await getListedJobsApi(latitude, longitude, page, limit, sortOrder, category ?? null);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch listed tasks");
    }
  }
);

// Get All Hot Tasks with Pagination (for AllHotJobsScreen)
export const getAllHotJobsPaginated = createAsyncThunk(
  "job/getAllHotJobsPaginated",
  async ({ location, page = 1, limit = 10, sortOrder = 'desc', append = false, category }: {
    location: string;
    page?: number;
    limit?: number;
    sortOrder?: string;
    append?: boolean;
    category?: string | null;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = await resolveCoordinates(state);
      const response = await getHotJobsApi(latitude, longitude, page, limit, sortOrder, category ?? null);
      return { ...response, append };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch hot tasks");
    }
  }
);

// Search Hot Tasks with Pagination
export const searchHotJobsPaginated = createAsyncThunk(
  "job/searchHotJobsPaginated",
  async ({
    location,
    search,
    page = 1,
    limit = 10,
    sortBy,
    sortOrder = 'desc',
    append = false,
    category,
  }: {
    location: string;
    search: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    append?: boolean;
    category?: string | null;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = await resolveCoordinates(state);
      const response = await searchHotJobsApi(latitude, longitude, search, page, limit, sortBy, sortOrder, category ?? null);
      return { ...response, append };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to search hot tasks");
    }
  }
);

// Search Listed Tasks with Pagination
export const searchListedJobsPaginated = createAsyncThunk(
  "job/searchListedJobsPaginated",
  async ({
    location,
    search,
    page = 1,
    limit = 10,
    sortBy,
    sortOrder = 'desc',
    append = false,
    category,
  }: {
    location: string;
    search: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    append?: boolean;
    category?: string | null;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = await resolveCoordinates(state);
      const response = await searchListedJobsApi(latitude, longitude, search, page, limit, sortBy, sortOrder, category ?? null);
      return { ...response, append };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to search listed tasks");
    }
  }
);

// Get All Listed Tasks with Pagination (for AllListedJobsScreen)
export const getAllListedJobsPaginated = createAsyncThunk(
  "job/getAllListedJobsPaginated",
  async ({ location, page = 1, limit = 10, sortOrder = 'desc', append = false, category }: {
    location: string;
    page?: number;
    limit?: number;
    sortOrder?: string;
    append?: boolean;
    category?: string | null;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = await resolveCoordinates(state);
      const response = await getListedJobsApi(latitude, longitude, page, limit, sortOrder, category ?? null);
      return { ...response, append };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch listed tasks");
    }
  }
);

// Get My Interested Tasks Async Thunk
export const getMyInterestedJobs = createAsyncThunk(
  "job/getMyInterestedJobs",
  async ({ page = 1, limit = 10, sortBy, sortOrder, append = false }: { 
    page?: number; 
    limit?: number; 
    sortBy?: string;
    sortOrder?: string;
    append?: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await getMyInterestedJobsApi(page, limit, sortBy, sortOrder);
      return { ...response, append };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to fetch interested tasks");
    }
  }
);

// Update Job Status Async Thunk
export const updateJobStatus = createAsyncThunk(
  "job/updateJobStatus",
  async ({ jobId, status }: { jobId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await updateJobStatusApi(jobId, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update task status");
    }
  }
);

// Expire Old Jobs (cleanup)
export const expireOldJobs = createAsyncThunk(
  "job/expireOldJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await expireOldJobsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to expire old tasks");
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
    setCurrentLocationCoordinates: (state, action: PayloadAction<{ latitude: number; longitude: number } | null>) => {
      state.currentLocationCoordinates = action.payload;
    },
    setLocationSource: (state, action: PayloadAction<JobState["locationSource"]>) => {
      state.locationSource = action.payload;
    },
    setIsDetectingLocation: (state, action: PayloadAction<boolean>) => {
      state.isDetectingLocation = action.payload;
    },
    setLocationPermissionStatus: (state, action: PayloadAction<JobState["locationPermissionStatus"]>) => {
      state.locationPermissionStatus = action.payload;
    },
    // Atomically set label + coordinates + source. Auto-detection will NOT
    // overwrite a location the user chose manually in this session.
    setDetectedLocation: (state, action: PayloadAction<SetDetectedLocationPayload>) => {
      const { fullAddress, latitude, longitude, source } = action.payload;
      if (source === "auto" && state.locationSource === "manual") {
        return; // respect manual override
      }
      state.currentLocation = fullAddress;
      state.currentLocationCoordinates = { latitude, longitude };
      state.locationSource = source;
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
      // Delete Task
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
      // Get Hot Tasks
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
      // Get Listed Tasks
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
      })
      // Get All Hot Tasks Paginated
      .addCase(getAllHotJobsPaginated.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
          state.allHotJobs = [];
        }
        state.error = null;
      })
      .addCase(getAllHotJobsPaginated.fulfilled, (state, action) => {
        const response = action.payload as HotJobsResponse & { append: boolean };
        if (response.status === 'success' && response.data?.jobs) {
          if (response.append) {
            // Append new jobs to existing list
            state.allHotJobs = [...state.allHotJobs, ...response.data.jobs];
          } else {
            // Replace with new jobs (refresh)
            state.allHotJobs = response.data.jobs;
          }
          if (response.data.pagination) {
            state.allHotJobsPagination = response.data.pagination;
          }
        }
        state.loading = false;
        state.loadingMore = false;
        state.error = null;
      })
      .addCase(getAllHotJobsPaginated.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.loadingMore = false;
      })
      // Search Hot Tasks Paginated
      .addCase(searchHotJobsPaginated.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
          state.allHotJobs = [];
        }
        state.error = null;
      })
      .addCase(searchHotJobsPaginated.fulfilled, (state, action) => {
        const response = action.payload as HotJobsResponse & { append: boolean };
        if (response.status === 'success' && response.data?.jobs) {
          if (response.append) {
            // Append new jobs to existing list
            state.allHotJobs = [...state.allHotJobs, ...response.data.jobs];
          } else {
            // Replace with new jobs (refresh)
            state.allHotJobs = response.data.jobs;
          }
          if (response.data.pagination) {
            state.allHotJobsPagination = response.data.pagination;
          }
        }
        state.loading = false;
        state.loadingMore = false;
        state.error = null;
      })
      .addCase(searchHotJobsPaginated.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.loadingMore = false;
      })
      // Get All Listed Tasks Paginated
      .addCase(getAllListedJobsPaginated.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
          state.allListedJobs = [];
        }
        state.error = null;
      })
      .addCase(getAllListedJobsPaginated.fulfilled, (state, action) => {
        const response = action.payload as ListedJobsResponse & { append: boolean };
        if (response.status === 'success' && response.data?.jobs) {
          if (response.append) {
            // Append new jobs to existing list
            state.allListedJobs = [...state.allListedJobs, ...response.data.jobs];
          } else {
            // Replace with new jobs (refresh)
            state.allListedJobs = response.data.jobs;
          }
          if (response.data.pagination) {
            state.allListedJobsPagination = response.data.pagination;
          }
        }
        state.loading = false;
        state.loadingMore = false;
        state.error = null;
      })
      .addCase(getAllListedJobsPaginated.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.loadingMore = false;
      })
      // Search Listed Tasks Paginated
      .addCase(searchListedJobsPaginated.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
          state.allListedJobs = [];
        }
        state.error = null;
      })
      .addCase(searchListedJobsPaginated.fulfilled, (state, action) => {
        const response = action.payload as ListedJobsResponse & { append: boolean };
        if (response.status === 'success' && response.data?.jobs) {
          if (response.append) {
            // Append new jobs to existing list
            state.allListedJobs = [...state.allListedJobs, ...response.data.jobs];
          } else {
            // Replace with new jobs (refresh)
            state.allListedJobs = response.data.jobs;
          }
          if (response.data.pagination) {
            state.allListedJobsPagination = response.data.pagination;
          }
        }
        state.loading = false;
        state.loadingMore = false;
        state.error = null;
      })
      .addCase(searchListedJobsPaginated.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.loadingMore = false;
      })
      // Get My Interested Tasks
      .addCase(getMyInterestedJobs.pending, (state, action) => {
        if (action.meta.arg.append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
          state.interestedJobs = [];
        }
        state.error = null;
      })
      .addCase(getMyInterestedJobs.fulfilled, (state, action) => {
        const response = action.payload as any;
        if (response.status === 'success' && response.data?.jobs) {
          if (response.append) {
            // Append new jobs to existing list
            state.interestedJobs = [...state.interestedJobs, ...response.data.jobs];
          } else {
            // Replace with new jobs (refresh)
            state.interestedJobs = response.data.jobs;
          }
          if (response.data.pagination) {
            state.interestedJobsPagination = response.data.pagination;
          }
        }
        state.loading = false;
        state.loadingMore = false;
        state.error = null;
      })
      .addCase(getMyInterestedJobs.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
        state.loadingMore = false;
      })
      // Update Job Status
      .addCase(updateJobStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        const response = action.payload as any;
        if (response.status === 'success' && response.data?.job) {
          const updatedJob = response.data.job;
          // Update job in jobs array
          state.jobs = state.jobs.map(job => 
            job._id === updatedJob.id || job._id === updatedJob._id ? { ...job, ...updatedJob } : job
          );
          // Update job in userJobs array
          state.userJobs = state.userJobs.map(job => 
            job._id === updatedJob.id || job._id === updatedJob._id ? { ...job, ...updatedJob } : job
          );
          // Update currentJob if it matches
          if (state.currentJob && (state.currentJob._id === updatedJob.id || state.currentJob._id === updatedJob._id)) {
            state.currentJob = { ...state.currentJob, ...updatedJob };
          }
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // Expire old jobs
      .addCase(expireOldJobs.pending, (state) => {
        state.error = null;
      })
      .addCase(expireOldJobs.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(expireOldJobs.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetCreateJobSuccess, setCurrentJob, setCurrentLocation, setCurrentLocationCoordinates, setLocationSource, setIsDetectingLocation, setLocationPermissionStatus, setDetectedLocation } = jobSlice.actions;
export default jobSlice.reducer;
