import { createSlice } from "@reduxjs/toolkit";

export type ILayer = "esriSat" | "osm" | "satellite" | "carto-light" | "carto-dark" | "carto-voyager";

export interface mapState {
  showOverviewMap: boolean;
  showPipMap: boolean;
  showPipMap2: boolean;
  layer: ILayer;
}

const initialState: mapState = {
  showOverviewMap: true,
  showPipMap: true,
  showPipMap2: true,
  layer: "esriSat",
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
    resetToDefault: () => initialState,
  },
});

export const { setShowOverviewMap, setShowPipMap, setShowPipMap2, setLayer, resetToDefault } = mapSlice.actions;

export default mapSlice.reducer;
