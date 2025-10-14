import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFavorites, addToFavorites, removeFromFavorites } from "../../api/favoriteApi";
import { RootState } from "../store";
import { School } from "../../interface/interfaces";

interface FavoriteState {
    favorites: School[];
    loading: boolean;
    error: string | null;
}

const initialState: FavoriteState = {
    favorites: [],
    loading: false,
    error: null,
};

// Fetch favorite schools
export const fetchFavorites = createAsyncThunk(
    "favorites/fetchFavorites",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getFavorites();
            return response.data.favoriteSchools;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// Add a school to favorites
export const addFavorite = createAsyncThunk(
    "favorites/addFavorite",
    async (school: any, { rejectWithValue }) => {
        try {
           
             await addToFavorites(school?._id);
            return school;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// Remove a school from favorites
export const removeFavorite = createAsyncThunk(
    "favorites/removeFavorite",
    async (schoolId: string, { rejectWithValue }) => {
        try {
            await removeFromFavorites(schoolId);
            return schoolId;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

const favoriteSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.favorites = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.favorites.push(action.payload);
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
              
                state.favorites = state.favorites.filter(
                    (school) => school._id !== action.payload
                );
            });
    },
});

export default favoriteSlice.reducer;
