import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getServiceCategoriesApi, ServiceCategoryDto } from "../../api/serviceCategoryApis";
import { ServiceCategory } from "../../interface/interfaces";

interface ServiceCategoryState {
  items: ServiceCategory[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

const initialState: ServiceCategoryState = {
  items: [],
  loading: false,
  error: null,
  lastFetchedAt: null,
};

export const fetchServiceCategories = createAsyncThunk(
  "serviceCategories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getServiceCategoriesApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Failed to load service categories");
    }
  }
);

const serviceCategorySlice = createSlice({
  name: "serviceCategories",
  initialState,
  reducers: {
    clearServiceCategoriesError: (state) => {
      state.error = null;
    },
    resetServiceCategories: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load service categories";
      })
      .addCase(fetchServiceCategories.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = null;
        const list: ServiceCategoryDto[] = action.payload?.data?.categories || [];
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

export const { clearServiceCategoriesError, resetServiceCategories } = serviceCategorySlice.actions;
export default serviceCategorySlice.reducer;
