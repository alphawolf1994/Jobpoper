import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Student  } from "../../interface/interfaces";
import { getSchoolStudents, getStudentById, getStudentFeeRecord } from "../../api/StudentApis";

interface SchoolsStateModal {
    loading: boolean;
    errors: string | null;
    schoolStudents:Student[];
    singleStudent:any |null;
    studentFeeRecord:string[];
   
  }
  
  const initialState: SchoolsStateModal = {
    loading: false,
    errors: null,
    schoolStudents:[],
    singleStudent:null,
    studentFeeRecord:[]
 

  };


// fetch the school Student
export const fetchSchoolStudents = createAsyncThunk(
  "schoolDetail/fetchSchoolStudents",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolStudents();
          return response;
      } catch (error: any) {
        console.log("error =>",error)
          return rejectWithValue(error?.message || "Failed to fetch students");
      }
  }
);

// fetch the Student by id
export const fetchstudentDetails = createAsyncThunk(
    "schoolDetail/fetchstudentDetails",
    async (id:string, { rejectWithValue }) => {
        try {
            const response = await getStudentById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch student");
        }
    }
);
// fetch the Student fee record id
export const fetchstudentFeeRecord = createAsyncThunk(
    "schoolDetail/fetchstudentFeeRecord",
    async (id:string, { rejectWithValue }) => {
        try {
            const response = await getStudentFeeRecord(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch student");
        }
    }
);



const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
       
      .addCase(fetchSchoolStudents.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolStudents.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolStudents.fulfilled, (state, action) => {
        state.schoolStudents = action.payload.data.students;
        state.loading = false;
        state.errors = null;
        
      })
      .addCase(fetchstudentDetails.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.singleStudent=[];
      })
      .addCase(fetchstudentDetails.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchstudentDetails.fulfilled, (state, action) => {
        state.singleStudent = action.payload.data.student;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchstudentFeeRecord.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.studentFeeRecord=[];
      })
      .addCase(fetchstudentFeeRecord.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchstudentFeeRecord.fulfilled, (state, action) => {
        state.studentFeeRecord = action.payload.data.studentFeeRecord;
        state.loading = false;
        state.errors = null;
      })
     
    },
  });

export default studentSlice.reducer;
