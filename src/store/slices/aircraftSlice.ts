import { createSlice } from "@reduxjs/toolkit";
import type { Aircraft } from "../services/api";

export interface aircraftState {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
  showAircraft: boolean;
  showAircraftNames: boolean;
  showAircraftPaths: boolean;
}

const initialState: aircraftState = {
  aircraft: [],
  selectedAircraft: null,
  showAircraft: true,
  showAircraftNames: false,
  showAircraftPaths: false,
};

const aircraftSlice = createSlice({
  name: "aircraft",
  initialState,

  reducers: {
    setSelectedAircraft: (state, action) => {
      state.selectedAircraft = action.payload;
    },
    setShowAircraft: (state, action) => {
      state.showAircraft = action.payload;
    },
    setShowAircraftNames: (state, action) => {
      state.showAircraftNames = action.payload;
    },
    setShowAircraftPaths: (state, action) => {
      state.showAircraftPaths = action.payload;
    },
  },
});

export const { setSelectedAircraft, setShowAircraft, setShowAircraftNames, setShowAircraftPaths } =
  aircraftSlice.actions;

export default aircraftSlice.reducer;
