import { createSlice } from "@reduxjs/toolkit";

export type IDrawMode = "point" | "polyline" | "polygon" | null;

export interface drawState {
  drawMode: IDrawMode;
}

const initialState: drawState = {
  drawMode: null,
};

const drawSlice = createSlice({
  name: "draw",
  initialState,

  reducers: {
    setDrawMode: (state, action) => {
      state.drawMode = action.payload;
    },
  },
});

export const { setDrawMode } = drawSlice.actions;

export default drawSlice.reducer;
