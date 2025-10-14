import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSchoolReviews, saveReview, updateReview, deleteReview, likeDislikeReview } from "../../api/reviewApis";
import { RootState } from "../store";
import { Review } from "../../interface/interfaces";

interface ReviewsState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
}

const initialState: ReviewsState = {
    reviews: [],
    loading: false,
    error: null,
};

// Fetch reviews for a specific school
export const fetchSchoolReviews = createAsyncThunk(
    "reviews/fetchSchoolReviews",
    async (schoolId: string, { rejectWithValue }) => {
        try {
            const response = await getSchoolReviews(schoolId);
           
            return response.data.reviews;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// Save a review
export const submitReview = createAsyncThunk(
    "reviews/submitReview",
    async (reviewData: any, { rejectWithValue }) => {
        try {
            const response = await saveReview(reviewData);
            return response.data.review;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// Update a review
export const modifyReview = createAsyncThunk(
    "reviews/modifyReview",
    async ({ reviewId, updatedData }: { reviewId: string; updatedData: any }, { rejectWithValue }) => {
        try {
            const response = await updateReview(reviewId, updatedData);
            return response.data.review;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// Delete a review
export const removeReview = createAsyncThunk(
    "reviews/removeReview",
    async (reviewId: string, { rejectWithValue }) => {
        try {
            await deleteReview(reviewId);
            return reviewId;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

// Like/Dislike a review
export const toggleLikeReview = createAsyncThunk(
    "reviews/toggleLikeReview",
    async ({ reviewId, action }: { reviewId: string; action: string }, { rejectWithValue }) => {
        try {
            const response = await likeDislikeReview(reviewId, action);
            return response.data.review;
        } catch (error: any) {
            return rejectWithValue(error?.message);
        }
    }
);

const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSchoolReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchoolReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload;
            })
            .addCase(fetchSchoolReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(submitReview.fulfilled, (state, action) => {
                state.reviews.push(action.payload);
            })
            .addCase(modifyReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.map((review) =>
                    review._id === action.payload._id ? action.payload : review
                );
            })
            .addCase(removeReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter((review) => review._id !== action.payload);
            })
            .addCase(toggleLikeReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.map((review) =>
                    review._id === action.payload._id ? action.payload : review
                );
            });
    },
});

export default reviewSlice.reducer;
