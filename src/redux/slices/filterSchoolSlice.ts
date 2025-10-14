import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFilteredSchools, getLocationSuggestions, getSchoolNameSuggestions } from "../../api/filterSchoolApis";
import { RootState } from "../store";
import { School } from "../../interface/interfaces";

interface FilterSchoolState {
    filteredSchools: School[];
    locationSuggestions: string[];
    schoolNameSuggestions: string[];
    loading: boolean;
    error: string | null;
}

const initialState: FilterSchoolState = {
    filteredSchools: [],
    locationSuggestions: [],
    schoolNameSuggestions: [],
    loading: false,
    error: null,
};

export const fetchFilteredSchools = createAsyncThunk(
    "schools/fetchFilteredSchools",
    async (filters: Record<string, string>, { rejectWithValue }) => {
        try {
            const response = await getFilteredSchools(filters);
         
            return response.data.schools;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch schools");
        }
    }
);

export const fetchLocationSuggestions = createAsyncThunk(
    "schools/fetchLocationSuggestions",
    async (query: string, { rejectWithValue }) => {
        try {
            if (query.length < 3) return [];
            const response = await getLocationSuggestions(query);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch location suggestions");
        }
    }
);

export const fetchSchoolNameSuggestions = createAsyncThunk(
    "schools/fetchSchoolNameSuggestions",
    async (query: string, { rejectWithValue }) => {
        try {
            if (query.length < 3) return [];
            const response = await getSchoolNameSuggestions(query);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to fetch school name suggestions");
        }
    }
);

const filterSchoolSlice = createSlice({
    name: "filterSchools",
    initialState,
    reducers: {
        clearSuggestions: (state) => {
            state.locationSuggestions = [];
            state.schoolNameSuggestions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilteredSchools.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFilteredSchools.fulfilled, (state, action) => {
                state.loading = false;
                state.filteredSchools = action.payload;
            })
            .addCase(fetchFilteredSchools.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchLocationSuggestions.fulfilled, (state, action) => {
                state.locationSuggestions = action.payload;
            })
            .addCase(fetchSchoolNameSuggestions.fulfilled, (state, action) => {
                state.schoolNameSuggestions = action.payload;
            });
    },
});

export const { clearSuggestions } = filterSchoolSlice.actions;
export default filterSchoolSlice.reducer;