import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { createLoanRequestApi, getLoanOptions, getMyLoanApplicationsApi } from "../../api/loanManagementApis";
import { LoanApplication } from "../../interface/interfaces";

interface LoanStateModal {
   
    loading: boolean;
    errors: string | null;
    loanOptions:any;
    myLoanApplications:LoanApplication[];
   
   
  }
  
  const initialState: LoanStateModal = {
    loading: false,
    errors: null,
    loanOptions:[],
    myLoanApplications:[],
    
  };




// fetch the loan options
export const fetchLoanOptions = createAsyncThunk(
  "schoolDetail/fetchLoanOptions",
  async (
    { productName, requestedAmount, interestRate }: 
    { productName?: string; requestedAmount?: number; interestRate?: number }, 
    { rejectWithValue }
  ) => {
      try {
          const response = await getLoanOptions(productName, requestedAmount, interestRate);
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch loan options");
      }
  }
);

// create loan request
export const createLoanRequest = createAsyncThunk(
  "user/createLoanRequest",
  async (data:{loanProduct: string,name:string,email: string,requestedAmount:string,specifications:string}  , { rejectWithValue }) => {
    try {
      const response = await createLoanRequestApi(data);
   
      return response.data;
    } catch (error: any) {
 
      return rejectWithValue(error.message || "Could not submit your loan request.");
    }
  }
);


// fetch the loan applications
export const fetchMyLoanApplications = createAsyncThunk(
  "schoolDetail/fetchMyLoanApplications",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getMyLoanApplicationsApi();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch loan applications");
      }
  }
);


const loanSlice = createSlice({
    name: "loan",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
       
      .addCase(fetchLoanOptions.pending, (state) => {
        state.loanOptions = [];
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchLoanOptions.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchLoanOptions.fulfilled, (state, action) => {
        state.loanOptions = action.payload.data.products;
        state.loading = false;
        state.errors = null;
      })
      .addCase(createLoanRequest.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(createLoanRequest.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(createLoanRequest.fulfilled, (state, action) => {
        
        state.loading = false;
        state.errors = null;
      })
       .addCase(fetchMyLoanApplications.pending, (state) => {
        state.myLoanApplications = [];
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchMyLoanApplications.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchMyLoanApplications.fulfilled, (state, action) => {
        state.myLoanApplications = action.payload.data.applications;
        state.loading = false;
        state.errors = null;
      })
     
     
    },
  });

export default loanSlice.reducer;
