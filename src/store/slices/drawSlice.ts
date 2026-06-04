import { createSlice } from "@reduxjs/toolkit";

export type IDrawMode = "point" | "polyline" | "polygon" | null;

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface DrawEntity {
  id: string;
  name?: string;
  type: IDrawMode;
  positions: Position[];
  icon?: string;
}

export interface drawState {
  drawMode: IDrawMode;
  entities: DrawEntity[];
  selectedEntity: DrawEntity | null;
}

const initialState: drawState = {
  drawMode: null,
  entities: [],
  selectedEntity: null,
};

const drawSlice = createSlice({
  name: "draw",
  initialState,

  reducers: {
    setSelectedEntity: (state, action) => {
      state.selectedEntity = action.payload;
    },
    setDrawMode: (state, action) => {
      state.drawMode = action.payload;
    },
    addEntity: (state, action) => {
      state.entities = [...state.entities, action.payload];
      state.selectedEntity = action.payload;
    },
    editEntity: (state, action) => {
      const { id } = action.payload;
      state.entities = state.entities.map((entity) => {
        if (entity.id === id) {
          return action.payload;
        }
        return entity;
      });
    },
    deleteEntity: (state, action) => {
      const { id } = action.payload;
      state.entities = state.entities.filter((entity) => entity.id !== id);
    },
    setEntites: (state, action) => {
      state.entities = action.payload;
    },
  },
});

export const { setSelectedEntity, setDrawMode, addEntity, editEntity, deleteEntity, setEntites } = drawSlice.actions;

export default drawSlice.reducer;
