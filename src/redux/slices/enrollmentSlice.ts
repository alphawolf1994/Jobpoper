import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEnrollments, saveEnrollment, checkEnrollment, removeEnrollment } from "../../api/enrollmentApis";
import { RootState } from "../store";

interface EnrollmentState {
    enrollments: any[];
    enrollment: any | null;
    isEnrolled: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: EnrollmentState = {
    enrollments: [],
    enrollment: null,
    isEnrolled: false,
    loading: false,
    error: null,
};

// Fetch all enrollments for the user
export const fetchEnrollments = createAsyncThunk(
    "enrollment/fetchEnrollments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getEnrollments();
            return response.data.enrollments;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// Save an enrollment
export const submitEnrollment = createAsyncThunk(
    "enrollment/submitEnrollment",
    async (enrollmentData: any, { rejectWithValue }) => {
        try {
            const response = await saveEnrollment(enrollmentData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// Check if a user is enrolled in a specific school
export const verifyEnrollment = createAsyncThunk(
    "enrollment/verifyEnrollment",
    async (schoolId: string, { rejectWithValue }) => {
        try {
            const response = await checkEnrollment(schoolId);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// Remove an enrollment
export const deleteEnrollment = createAsyncThunk(
    "enrollment/deleteEnrollment",
    async (enrollmentId: string, { rejectWithValue }) => {
        try {
            await removeEnrollment(enrollmentId);
            return enrollmentId;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEnrollments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnrollments.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollments = action.payload;
            })
            .addCase(fetchEnrollments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(submitEnrollment.fulfilled, (state, action) => {
                state.enrollment = action.payload;
            })
            .addCase(verifyEnrollment.fulfilled, (state, action) => {
                state.isEnrolled = action.payload.data.enrolled;
                state.enrollment = action.payload.data || null;
            })
            .addCase(deleteEnrollment.fulfilled, (state, action) => {
                state.enrollments = state.enrollments.filter((enrollment) => enrollment._id !== action.payload);
            });
    },
});

export default enrollmentSlice.reducer;