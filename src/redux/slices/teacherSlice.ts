import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";
import {  DaySchedule, Student, Teacher, } from "../../interface/interfaces";

import { getSchoolTeachers, getStudentsOfClass, getTeacherById, getTeacherDetails, getTeacherTimetable, updateTeacherById } from "../../api/teacherApis";

interface SchoolsStateModal {
   
    loading: boolean;
    errors: string | null;
    schoolTeachers:Teacher[];
    singleTeacher:any | null;
    teacherDetails:Teacher;
    classStudents:Student[];
    teacherTimetable:DaySchedule[]
   
  }
  
  const initialState: SchoolsStateModal = {
    loading: false,
    errors: null,
    schoolTeachers:[],
    singleTeacher:null,
    teacherDetails:{},
    classStudents:[],
    teacherTimetable:[]
  };




// fetch the school teachers
export const fetchSchoolTeachers = createAsyncThunk(
  "schoolDetail/fetchSchoolTeachers",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getSchoolTeachers();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch teachers");
      }
  }
);

// fetch the teacher by id
export const fetchTeacherDetails = createAsyncThunk(
    "schoolDetail/fetchTeacherDetails",
    async (id:string, { rejectWithValue }) => {
        try {
            const response = await getTeacherById(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch teacher");
        }
    }
);
// fetch the school teachers
export const fetchOwnDetails = createAsyncThunk(
  "schoolDetail/fetchOwnDetails",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getTeacherDetails();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch teacher");
      }
  }
);

export const updateTeacherProfile = createAsyncThunk(
  "schoolDetail/updateTeacherProfile",
  async (
    params: { teacherId: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const { teacherId, data } = params;
      const response = await updateTeacherById( teacherId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to update the school info");
    }
  }
);
// fetch the school subjects
export const fetchStudentsOfClass = createAsyncThunk(
  "schoolDetail/fetchStudentsOfClass",
  async (classId:string, { rejectWithValue }) => {
      try {
          const response = await getStudentsOfClass(classId);
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch students");
      }
  }
);
// fetch the teacher timetable
export const fetchTeacherTimetable = createAsyncThunk(
  "schoolDetail/fetchTeacherTimetable",
  async (_, { rejectWithValue }) => {
      try {
          const response = await getTeacherTimetable();
          return response;
      } catch (error: any) {
          return rejectWithValue(error?.message || "Failed to fetch timetable");
      }
  }
);
const teacherSlice = createSlice({
    name: "schools",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
       
      .addCase(fetchSchoolTeachers.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(fetchSchoolTeachers.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchSchoolTeachers.fulfilled, (state, action) => {
        state.schoolTeachers = action.payload.data.teachers;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchTeacherDetails.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.singleTeacher=[];
      })
      .addCase(fetchTeacherDetails.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchTeacherDetails.fulfilled, (state, action) => {
        state.singleTeacher = action.payload.data.teacher;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchOwnDetails.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.teacherDetails={};
      })
      .addCase(fetchOwnDetails.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchOwnDetails.fulfilled, (state, action) => {
        state.teacherDetails = action.payload.data.teacher;
        state.loading = false;
        state.errors = null;
      })
      .addCase(updateTeacherProfile.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(updateTeacherProfile.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(updateTeacherProfile.fulfilled, (state, action) => {
        state.errors = null;
          state.loading = false;
       
      })
      .addCase(fetchStudentsOfClass.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.classStudents=[];
      })
      .addCase(fetchStudentsOfClass.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
     
      })
      .addCase(fetchStudentsOfClass.fulfilled, (state, action) => {
        state.classStudents = action.payload.data;
        state.loading = false;
        state.errors = null;
      })
      .addCase(fetchTeacherTimetable.pending, (state) => {
        state.loading = true;
        state.errors = null;
        state.teacherTimetable=[];
      })
      .addCase(fetchTeacherTimetable.rejected, (state, action) => {
        state.errors = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchTeacherTimetable.fulfilled, (state, action) => {
        state.teacherTimetable = action.payload.data;
        state.loading = false;
        state.errors = null;
      })
     
    },
  });

export default teacherSlice.reducer;
