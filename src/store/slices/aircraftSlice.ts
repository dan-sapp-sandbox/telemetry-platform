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

export type Aircraft = {
  id: string;
  name: string;
  type: "Cargo" | "Tanker" | "Fishing" | "Passenger";
  lat: number;
  lon: number;
  heading: number;
  speed: number;
};

export type RoutedAircraft = {
  id: string;
  name: string;
  routeName: string;
};

export interface aircraftState {
  aircraft: RoutedAircraft[];
  selectedAircraft: RoutedAircraft | null;
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
    setAircraft: (state, action) => {
      state.aircraft = action.payload;
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

export const { setSelectedAircraft, setAircraft, setShowAircraft, setShowAircraftNames, setShowAircraftPaths } =
  aircraftSlice.actions;

export default aircraftSlice.reducer;
