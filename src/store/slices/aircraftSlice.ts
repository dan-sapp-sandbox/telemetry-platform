import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Aircraft, AircraftMap } from "../services/api";

export interface AircraftState {
  aircraftMap: AircraftMap;
  selectedAircraft: Aircraft | null;
}

const initialState: AircraftState = {
  aircraftMap: {}, // ✅ NEVER null
  selectedAircraft: null,
};

const aircraftSlice = createSlice({
  name: "aircraft",
  initialState,

  reducers: {
    setAircraftMap: (state, action: PayloadAction<AircraftMap>) => {
      state.aircraftMap = action.payload;
    },

    mergeAircraftMap: (state, action: PayloadAction<AircraftMap>) => {
      const incoming = action.payload;

      for (const icao in incoming) {
        if (!state.aircraftMap[icao]) {
          state.aircraftMap[icao] = [];
        }

        state.aircraftMap[icao].push(...incoming[icao]);
      }
    },

    setSelectedAircraft: (state, action: PayloadAction<Aircraft | null>) => {
      state.selectedAircraft = action.payload;
    },
  },
});

export const { setAircraftMap, mergeAircraftMap, setSelectedAircraft } = aircraftSlice.actions;

export default aircraftSlice.reducer;
