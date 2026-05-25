import { createSlice } from "@reduxjs/toolkit";

export type ILayer = "esriSat" | "osm" | "satellite" | "carto-light" | "carto-dark" | "carto-voyager";

export type IDataLayer = "vessels" | "aircraft" | "population-density";

export interface mapState {
  showOverviewMap: boolean;
  showPipMap: boolean;
  showPipMap2: boolean;
  layer: ILayer;
  dataLayer: IDataLayer | null;
  trackedEntityId: string | null;
}

const initialState: mapState = {
  showOverviewMap: false,
  showPipMap: true,
  showPipMap2: false,
  layer: "satellite",
  dataLayer: null,
  trackedEntityId: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,

  reducers: {
    setShowOverviewMap: (state, action) => {
      state.showOverviewMap = action.payload;
    },
    setShowPipMap: (state, action) => {
      state.showPipMap = action.payload;
    },
    setShowPipMap2: (state, action) => {
      state.showPipMap2 = action.payload;
    },
    setLayer: (state, action) => {
      state.layer = action.payload;
    },
    setDataLayer: (state, action) => {
      state.dataLayer = action.payload;
    },
    setTrackedEntityId: (state, action) => {
      state.trackedEntityId = action.payload;
    },
    resetToDefault: () => initialState,
  },
});

export const {
  setTrackedEntityId,
  setShowOverviewMap,
  setShowPipMap,
  setShowPipMap2,
  setLayer,
  setDataLayer,
  resetToDefault,
} = mapSlice.actions;

export default mapSlice.reducer;
