import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { createSchoolStaffApi, getSchoolStaff } from "../../api/StaffApis";

interface SchoolsStateModal {
   
    loading: boolean;
    errors: string | null;
    schoolStaff:any;
   
   
  }
  
  const initialState: SchoolsStateModal = {
    loading: false,
    errors: null,
    schoolStaff:[],
    
  };




// fetch the school staff
export const fetchSchoolStaff = createAsyncThunk(
  "schoolDetail/fetchSchoolStaff",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolStaff();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch school Staff");
      }
  }
);
// Create a department
export const CreateStaff = createAsyncThunk(
    "staff/CreateStaff",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await createSchoolStaffApi(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);




const StaffSlice = createSlice({
    name: "staff",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
       
      .addCase(fetchSchoolStaff.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolStaff.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolStaff.fulfilled, (state, action) => {
        state.schoolStaff = action.payload.data;
        state.loading = false;
        state.errors = null;
      })
        .addCase(CreateStaff.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(CreateStaff.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(CreateStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.errors = null;
      })
     
     
    },
  });

export default StaffSlice.reducer;
