import { createSlice } from "@reduxjs/toolkit";
import type { AISVessel } from "../services/api";

export interface vesselState {
  vessels: AISVessel[];
  selectedVessel: AISVessel | null;
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
    setGlobalVessels: (state, action) => {
      state.vessels = action.payload;
    },
  },
});

export const { setSelectedVessel, setGlobalVessels } = vesselSlice.actions;

export default vesselSlice.reducer;
