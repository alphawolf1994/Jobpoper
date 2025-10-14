import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSchool, updateSchoolDetails } from "../../api/schoolApis";
import { RootState } from "../store";
import { School } from "../../interface/interfaces";


interface SchoolsStateModal {
    school: School | null;
    loading: boolean;
    errors: string | null;
    schoolProfile: School| null;
  }
  
  const initialState: SchoolsStateModal = {
    school: null,
    loading: false,
    errors: null,
    schoolProfile:null,
  };



  export const fetchSchoolDetail = createAsyncThunk(
    "schoolDetail/fetchSchoolDetail",
    async (schoolId:string, { rejectWithValue }) => {
        try {
            const response = await getSchool(schoolId);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch school details");
        }
    }
);
export const fetchSchoolProfile = createAsyncThunk(
  "schoolDetail/fetchSchoolProfile",
  async (schoolId:string, { rejectWithValue }) => {
      try {
          const response = await getSchool(schoolId);
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch school details");
      }
  }
);

export const updateSchoolProfile = createAsyncThunk(
  "schoolDetail/updateSchoolProfile",
  async (
    params: { schoolId: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const { schoolId, data } = params;
      const response = await updateSchoolDetails( schoolId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update the school info");
    }
  }
);


const schoolDetailSlice = createSlice({
    name: "schoolDetail",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchSchoolDetail.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchSchoolDetail.rejected, (state, action) => {
          state.errors = action.payload as string;
          state.loading = false;
        })
        .addCase(fetchSchoolDetail.fulfilled, (state, action) => {
          if (action.payload?.data) {
            
           
              state.school = action.payload.data.school;
            state.loading = false;
          } else {
            state.loading = false;
          }
        })
        .addCase(fetchSchoolProfile.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchSchoolProfile.rejected, (state, action) => {
          state.errors = action.payload as string;
          state.loading = false;
        })
        .addCase(fetchSchoolProfile.fulfilled, (state, action) => {
          if (action.payload?.data) {
        
           
              state.schoolProfile = action.payload.data.school;
            state.loading = false;
          } else {
            state.loading = false;
          }
        })

        .addCase(updateSchoolProfile.pending, (state) => {
          state.loading = true;
          state.errors = null;
        })
        .addCase(updateSchoolProfile.rejected, (state, action) => {
          state.errors = action.payload as string;
          state.loading = false;
        })
        .addCase(updateSchoolProfile.fulfilled, (state, action) => {
          state.errors = null;
            state.loading = false;
         
        })
       
    },
  });

export default schoolDetailSlice.reducer;
