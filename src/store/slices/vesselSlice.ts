import { createSlice } from "@reduxjs/toolkit";

export type RoutePoint = {
  lat: number;
  lon: number;
};

export type Route = {
  id: string;
  name: string;
  points: RoutePoint[];
};

export type Vessel = {
  id: string;
  name: string;
  type: "Cargo" | "Tanker" | "Fishing" | "Passenger";
  lat: number;
  lon: number;
  heading: number; // radians
  speed: number;
};

export type RoutedVessel = {
  id: string;
  name: string;
  routeName: string;
};

export interface vesselState {
  vessels: RoutedVessel[];
  selectedVessel: RoutedVessel | null;
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

export const { setSelectedVessel, setVessels, setShowVessels, setShowVesselNames, setShowVesselPaths } =
  vesselSlice.actions;

export default vesselSlice.reducer;
