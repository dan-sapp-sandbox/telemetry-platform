import { createSlice } from "@reduxjs/toolkit";

export type ILayer =
  | "esriSat"
  | "osm"
  | "satellite"
  | "carto-light"
  | "carto-dark"
  | "carto-voyager"
  | "population-density";

export interface mapState {
  showOverviewMap: boolean;
  showPipMap: boolean;
  showPipMap2: boolean;
  layer: ILayer;
  trackedEntityId: string | null;
}

const initialState: mapState = {
  showOverviewMap: false,
  showPipMap: true,
  showPipMap2: false,
  layer: "satellite",
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
    setTrackedEntityId: (state, action) => {
      state.trackedEntityId = action.payload;
    },
    resetToDefault: () => initialState,
  },
});

export const { setTrackedEntityId, setShowOverviewMap, setShowPipMap, setShowPipMap2, setLayer, resetToDefault } =
  mapSlice.actions;

export default mapSlice.reducer;
