import { createSlice } from "@reduxjs/toolkit";

export type Aircraft = {
  id: string;
  name: string;
  type: "Cargo" | "Tanker" | "Fishing" | "Passenger";
  lat: number;
  lon: number;
  heading: number; // radians
  speed: number;
};

export interface aircraftState {
  aircraft: Aircraft[];
  showAircraft: boolean;
  showAircraftPaths: boolean;
}

const initialState: aircraftState = {
  aircraft: [],
  showAircraft: false,
  showAircraftPaths: false,
};

const aircraftSlice = createSlice({
  name: "aircraft",
  initialState,

  reducers: {
    addAircraft: (state, action) => {
      state.aircraft = [...state.aircraft, action.payload];
    },
    setShowAircraft: (state, action) => {
      state.showAircraft = action.payload;
    },
    setShowAircraftPaths: (state, action) => {
      state.showAircraftPaths = action.payload;
    },
  },
});

export const { addAircraft, setShowAircraft, setShowAircraftPaths } = aircraftSlice.actions;

export default aircraftSlice.reducer;
