import { createSlice } from "@reduxjs/toolkit";

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
  selectedVessel: Vessel | null;
  showVessels: boolean;
  showVesselNames: boolean;
  showVesselPaths: boolean;
}

const initialState: vesselState = {
  vessels: [],
  selectedVessel: null,
  showVessels: true,
  showVesselNames: false,
  showVesselPaths: false,
};

const vesselSlice = createSlice({
  name: "vessel",
  initialState,

  reducers: {
    setSelectedVesselById: (state, action) => {
      console.log("vessels", state.vessels);
      console.log("action.payload", action.payload);
      console.log(
        "test",
        state.vessels.find((vessel) => vessel.id === action.payload),
      );
      state.selectedVessel = state.vessels.find((vessel) => vessel.id === action.payload) || null;
    },
    setSelectedVessel: (state, action) => {
      state.selectedVessel = action.payload;
    },
    setVessels: (state, action) => {
      state.vessels = action.payload;
    },
    setShowVessels: (state, action) => {
      state.showVessels = action.payload;
    },
    setShowVesselNames: (state, action) => {
      state.showVesselNames = action.payload;
    },
    setShowVesselPaths: (state, action) => {
      state.showVesselPaths = action.payload;
    },
  },
});

export const {
  setSelectedVesselById,
  setSelectedVessel,
  setVessels,
  setShowVessels,
  setShowVesselNames,
  setShowVesselPaths,
} = vesselSlice.actions;

export default vesselSlice.reducer;
