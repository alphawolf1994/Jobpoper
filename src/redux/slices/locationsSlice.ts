import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
};

const initialState: LocationsState = {
  items: [],
};

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
    },
  },
});

export const { addLocation, removeLocation, clearLocations } = locationsSlice.actions;
export default locationsSlice.reducer;

