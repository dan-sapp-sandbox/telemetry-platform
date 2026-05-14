import { createSlice } from "@reduxjs/toolkit";
import { mockVessels } from "../mockData/initVessels";

export type Vessel = {
  id: string;
  name: string;
  type: "Cargo" | "Tanker" | "Fishing" | "Passenger";
  lat: number;
  lon: number;
  heading: number; // radians
  speed: number;
};

export interface vesselState {
  vessels: Vessel[];
  showVessels: boolean;
  showVesselPaths: boolean;
}

const initialState: vesselState = {
  vessels: mockVessels,
  showVessels: false,
  showVesselPaths: false,
};

const vesselSlice = createSlice({
  name: "vessel",
  initialState,

  reducers: {
    setVessels: (state, action) => {
      state.vessels = action.payload;
    },
    setShowVessels: (state, action) => {
      state.showVessels = action.payload;
    },
    setShowVesselPaths: (state, action) => {
      state.showVesselPaths = action.payload;
    },
  },
});

export const { setVessels, setShowVessels, setShowVesselPaths } = vesselSlice.actions;

export default vesselSlice.reducer;
