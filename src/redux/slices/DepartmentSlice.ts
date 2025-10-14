import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { createSchoolDepartmentApi, getSchoolDepartment } from "../../api/DepartmentApis";

interface SchoolsStateModal {
   
    loading: boolean;
    errors: string | null;
    schoolDepartment:any;
   
   
  }
  
  const initialState: SchoolsStateModal = {
    loading: false,
    errors: null,
    schoolDepartment:[],
    
  };




// fetch the school staff
export const fetchSchoolDepartment = createAsyncThunk(
  "schoolDetail/fetchSchoolDepartment",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolDepartment();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch school Department");
      }
  }
);

// Create a department
export const CreateDepartment = createAsyncThunk(
    "enrollment/submitEnrollment",
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await createSchoolDepartmentApi(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);


const DepartmentSlice = createSlice({
    name: "Department",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
       
      .addCase(fetchSchoolDepartment.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolDepartment.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolDepartment.fulfilled, (state, action) => {
        state.schoolDepartment = action.payload.data;
        state.loading = false;
        state.errors = null;
      })
       .addCase(CreateDepartment.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(CreateDepartment.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(CreateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.errors = null;
      })
     
     
    },
  });

export default DepartmentSlice.reducer;
