import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addPaymentMethodApi, deletePaymentMethodApi, getPaymentMethodsApi } from "../../api/PaymentMethodApis";

interface SchoolsStateModal {
   
    loading: boolean;
    errors: string | null;
    paymentMethods:any;
   
   
  }
  
  const initialState: SchoolsStateModal = {
    loading: false,
    errors: null,
    paymentMethods:[],
    
  };




// fetch the payment methods    
export const fetchPaymentMethods = createAsyncThunk(
  "paymentMethods/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getPaymentMethodsApi();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch payment methods");
      }
  }
);
//delete payment method 
export const deletePaymentMethod = createAsyncThunk(
  "paymentMethods/deletePaymentMethod",
  async (id:any, { rejectWithValue }) => {
      try {
          const response = await deletePaymentMethodApi(id);
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to delete payment method");
      }
  }
);
// payment method slice
export  const addPaymentMethod = createAsyncThunk(
  "paymentMethods/addPaymentMethod",
  async (data:any, { rejectWithValue }) => {
      try {
          const response = await addPaymentMethodApi(data);
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to delete payment method");
      }
  }
);





const PaymentMethodSlice = createSlice({
    name: "paymentMethod",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
       
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
        state.paymentMethods = [];
     
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload.data;
        state.loading = false;
        state.errors = null;
      })
      .addCase(deletePaymentMethod.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.errors = null;
      })
      .addCase(addPaymentMethod.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.errors = null;
      })
       
     
     
    },
  });

export default PaymentMethodSlice.reducer;
