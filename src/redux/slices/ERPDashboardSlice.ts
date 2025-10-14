import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getApprovedRequestApi, getLoanPaymentApi, getNewRequesttApi, getOtherPaymentApi, getRejectedRequestApi, getReportCell, getSalaryPaymentApi, getSpecialPaymentApi, getSummaryCountApi } from "../../api/ERPDashboardApis";

interface SchoolsStateModal {
   
    loading: boolean;
    errors: string | null;
    reports:any;
    reportDetails:any;
    newRequests:any;
    specialPayments:any;
    salaryPayments:any;
    loanPayments:any;
    otherPayments:any;
    approvedRequests:any;
    rejectedRequests:any;
    summaryAssets:any;
    summaryCapex:any;
    summaryOpex:any;
  
   
   
  }
  
  const initialState: SchoolsStateModal = {
    loading: false,
    errors: null,
    reports:[],
    reportDetails:[],
    newRequests:[],
    specialPayments:[],
    salaryPayments:[],
    loanPayments:[],
    otherPayments:[],
    approvedRequests:[],
    rejectedRequests:[],
    summaryAssets:null,
    summaryCapex:null,
    summaryOpex:null,
    
  };






// get reports
export const getReports = createAsyncThunk(
    "dashboard/getReports",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await getReportCell(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// get report details
export const getReportDetails = createAsyncThunk(
    "dashboard/getReportDetails",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await getReportCell(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// get new requests
export const getNewRequests = createAsyncThunk(
    "dashboard/getNewRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getNewRequesttApi();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);   
// get special payments
export const getSpecialPayments = createAsyncThunk(
    "dashboard/getSpecialPayments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSpecialPaymentApi();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);
// get salary payments
export const getSalaryPayments = createAsyncThunk(
    "dashboard/getSalaryPayments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSalaryPaymentApi();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);
// get loan payments
export const getLoanPayments = createAsyncThunk(
    "dashboard/getLoanPayments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getLoanPaymentApi();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);
// get other payments
export const getOtherPayments = createAsyncThunk(
    "dashboard/getOtherPayments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getOtherPaymentApi();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
); 
// get approved requests
export const getApprovedRequests = createAsyncThunk(
    "dashboard/getApprovedRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getApprovedRequestApi();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
); 
// get rejected requests
export const getRejectedRequests = createAsyncThunk(
    "dashboard/getRejectedRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getRejectedRequestApi();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);
// get summary counts
export const getSummaryCounts = createAsyncThunk(
    "dashboard/getSummaryCounts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSummaryCountApi();
            
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);   




const ERPDashboardSlice = createSlice({
    name: "Department",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
       
      .addCase(getReports.pending, (state) => {
        state.loading = true;
        state.errors = null;
         state.reports = [];
      })
      .addCase(getReports.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(getReports.fulfilled, (state, action) => {
        console.log("action.payload.data =>", action.payload);
        state.reports = action.payload;
        state.loading = false;
        state.errors = null;
      })
       .addCase(getReportDetails.pending, (state) => {
        state.loading = true;
        state.errors = null;
          state.reportDetails = [];
      })
      .addCase(getReportDetails.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(getReportDetails.fulfilled, (state, action) => {
          state.reportDetails = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addCase(getNewRequests.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.newRequests = [];
      })
      .addCase(getNewRequests.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(getNewRequests.fulfilled, (state, action) => {
        state.newRequests = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addCase(getSpecialPayments.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.specialPayments = [];
      })
      .addCase(getSpecialPayments.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(getSpecialPayments.fulfilled, (state, action) => {
        state.specialPayments = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addCase(getSalaryPayments.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.salaryPayments = [];
      })
      .addCase(getSalaryPayments.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(getSalaryPayments.fulfilled, (state, action) => {
        state.salaryPayments = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addCase(getLoanPayments.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.loanPayments = [];
      })
      .addCase(getLoanPayments.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(getLoanPayments.fulfilled, (state, action) => {
        state.loanPayments = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addCase(getOtherPayments.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.otherPayments = [];
      })
      .addCase(getOtherPayments.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(getOtherPayments.fulfilled, (state, action) => {
        state.otherPayments = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addCase(getApprovedRequests.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.approvedRequests = [];
      })
      .addCase(getApprovedRequests.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(getApprovedRequests.fulfilled, (state, action) => {
        state.approvedRequests = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addCase(getRejectedRequests.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.rejectedRequests = [];
      })
      .addCase(getRejectedRequests.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(getRejectedRequests.fulfilled, (state, action) => {
        state.rejectedRequests = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addCase(getSummaryCounts.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getSummaryCounts.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(getSummaryCounts.fulfilled, (state, action) => {
      
        state.summaryAssets = action.payload.assets;
        state.summaryCapex = action.payload.capex;
        state.summaryOpex = action.payload.opex;
        console.log("action.payload.data =>", action.payload);
        state.reports = action.payload;
        state.loading = false;
        state.errors = null;
      })
      .addDefaultCase((state) => {
        state.loading = false;
        state.errors = null;
      }
      );
     
     
    },
  });

export default ERPDashboardSlice.reducer;
