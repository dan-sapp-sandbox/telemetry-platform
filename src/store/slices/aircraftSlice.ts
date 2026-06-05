import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Aircraft } from "../services/api";

export interface AircraftState {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
}

const initialState: AircraftState = {
  aircraft: [],
  selectedAircraft: null,
};

const aircraftSlice = createSlice({
  name: "aircraft",
  initialState,

  reducers: {
    setGlobalAircraft: (state, action: PayloadAction<Aircraft[]>) => {
      state.aircraft = action.payload;
    },

    setSelectedAircraft: (state, action: PayloadAction<Aircraft | null>) => {
      state.selectedAircraft = action.payload;
    },
  },
});

export const { setGlobalAircraft, setSelectedAircraft } = aircraftSlice.actions;

export default aircraftSlice.reducer;
