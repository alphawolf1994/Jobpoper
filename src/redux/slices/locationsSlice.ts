import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { saveLocationApi, getLocationsApi, deleteLocationApi, LocationPayload } from '../../api/locationApis';

export type SavedLocation = {
  id: string;
  name: string; // Home, Office, etc
  fullAddress: string;
  latitude: number;
  longitude: number;
  addressDetails?: string; // floor, house no
  createdAt: number;
};

type LocationsState = {
  items: SavedLocation[];
  loading: boolean;
  error: string | null;
};

const initialState: LocationsState = {
  items: [],
  loading: false,
  error: null,
};

// Save location async thunk
export const saveLocation = createAsyncThunk(
  'locations/saveLocation',
  async (locationData: LocationPayload, { rejectWithValue }) => {
    try {
      const response = await saveLocationApi(locationData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to save location');
    }
  }
);

// Get all locations async thunk
export const fetchLocations = createAsyncThunk(
  'locations/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLocationsApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch locations');
    }
  }
);

// Delete location async thunk
export const removeLocationById = createAsyncThunk(
  'locations/removeLocationById',
  async (locationId: string, { rejectWithValue }) => {
    try {
      const response = await deleteLocationApi(locationId);
      return { locationId, response };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to delete location');
    }
  }
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    addLocation: (state, action: PayloadAction<SavedLocation>) => {
      // Replace if id already exists, else add to top
      const idx = state.items.findIndex((l) => l.id === action.payload.id);
      if (idx >= 0) state.items[idx] = action.payload;
      else state.items.unshift(action.payload);
    },
    removeLocation: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((l) => l.id !== action.payload);
    },
    clearLocations: (state) => {
      state.items = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Save location
      .addCase(saveLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveLocation.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.status === 'success' && response.data.location) {
          const location = response.data.location;
          const idx = state.items.findIndex((l) => l.id === location.id);
          if (idx >= 0) state.items[idx] = location;
          else state.items.unshift(location);
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(saveLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch locations
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.status === 'success' && response.data.locations) {
          state.items = response.data.locations;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete location
      .addCase(removeLocationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeLocationById.fulfilled, (state, action) => {
        state.items = state.items.filter((l) => l.id !== action.payload.locationId);
        state.loading = false;
        state.error = null;
      })
      .addCase(removeLocationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addLocation, removeLocation, clearLocations, clearError } = locationsSlice.actions;
export default locationsSlice.reducer;

