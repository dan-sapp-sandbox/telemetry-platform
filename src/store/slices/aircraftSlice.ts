import { createSlice } from "@reduxjs/toolkit";
import type { Aircraft } from "../services/api";

export interface aircraftState {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
}

const initialState: aircraftState = {
  aircraft: [],
  selectedAircraft: null,
};

const aircraftSlice = createSlice({
  name: "aircraft",
  initialState,

  reducers: {
    setGlobalAircraft: (state, action) => {
      state.aircraft = action.payload;
    },
    setSelectedAircraft: (state, action) => {
      state.selectedAircraft = action.payload;
    },
  },
});

export const { setGlobalAircraft, setSelectedAircraft } = aircraftSlice.actions;

export default aircraftSlice.reducer;
