import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createReportApi, getMyReportsApi } from "../../api/reportApis";
import { Report } from "../../interface/interfaces";

interface ReportState {
  submitLoading: boolean;
  submitError: string | null;
  submitted: boolean;

  myReports: Report[];
  myReportsLoading: boolean;
  myReportsError: string | null;
}

const initialState: ReportState = {
  submitLoading: false,
  submitError: null,
  submitted: false,

  myReports: [],
  myReportsLoading: false,
  myReportsError: null,
};

export const createReport = createAsyncThunk(
  "report/createReport",
  async (
    data: {
      jobId?: string | null;
      reportedUser?: string | null;
      reason?: string;
      description?: string;
      images?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      return await createReportApi(data);
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to submit report");
    }
  }
);

export const getMyReports = createAsyncThunk(
  "report/getMyReports",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyReportsApi(1, 50);
      return res?.data?.reports || [];
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to load your reports");
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    resetReportSubmitted: (state) => {
      state.submitted = false;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReport.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.submitted = false;
      })
      .addCase(createReport.fulfilled, (state) => {
        state.submitLoading = false;
        state.submitted = true;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = (action.payload as string) || "Failed to submit report";
      })
      .addCase(getMyReports.pending, (state) => {
        state.myReportsLoading = true;
        state.myReportsError = null;
      })
      .addCase(getMyReports.fulfilled, (state, action) => {
        state.myReportsLoading = false;
        state.myReports = action.payload as Report[];
      })
      .addCase(getMyReports.rejected, (state, action) => {
        state.myReportsLoading = false;
        state.myReportsError = (action.payload as string) || "Failed to load your reports";
      });
  },
});

export const { resetReportSubmitted } = reportSlice.actions;
export default reportSlice.reducer;
