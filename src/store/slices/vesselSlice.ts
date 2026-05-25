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
  heading: number;
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
}

const initialState: vesselState = {
  vessels: [],
  selectedVessel: null,
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
  },
});

export const { setSelectedVessel, setVessels } = vesselSlice.actions;

export default vesselSlice.reducer;
