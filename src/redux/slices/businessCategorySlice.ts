import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBusinessCategoriesApi, BusinessCategoryDto } from "../../api/businessCategoryApis";
import { BusinessCategory } from "../../interface/interfaces";

interface BusinessCategoryState {
  items: BusinessCategory[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

const initialState: BusinessCategoryState = {
  items: [],
  loading: false,
  error: null,
  lastFetchedAt: null,
};

export const fetchBusinessCategories = createAsyncThunk(
  "businessCategories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBusinessCategoriesApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to load business categories");
    }
  }
);

const businessCategorySlice = createSlice({
  name: "businessCategories",
  initialState,
  reducers: {
    clearBusinessCategoriesError: (state) => {
      state.error = null;
    },
    resetBusinessCategories: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load business categories";
      })
      .addCase(fetchBusinessCategories.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;
        const list: BusinessCategoryDto[] = action.payload?.data?.categories || [];
        state.items = list.map((item) => ({
          _id: item._id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          icon: item.icon,
          isActive: item.isActive,
          sortOrder: item.sortOrder,
        }));
        state.lastFetchedAt = Date.now();
      });
  },
});

export const { clearBusinessCategoriesError, resetBusinessCategories } = businessCategorySlice.actions;
export default businessCategorySlice.reducer;
