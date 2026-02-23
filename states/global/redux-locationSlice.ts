import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LocationState = {
  pickedLocation: { lat: number; lng: number } | null;
};

const initialState: LocationState = {
  pickedLocation: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setPickedLocation(state, action: PayloadAction<{ lat: number; lng: number } | null>) {
      state.pickedLocation = action.payload;
    },
  },
});

export const { setPickedLocation } = locationSlice.actions;
export default locationSlice.reducer;
