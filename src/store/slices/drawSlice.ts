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
}

const initialState: drawState = {
  drawMode: null,
  entities: [],
};

const drawSlice = createSlice({
  name: "draw",
  initialState,

  reducers: {
    setDrawMode: (state, action) => {
      state.drawMode = action.payload;
    },
    addEntity: (state, action) => {
      state.entities = [...state.entities, action.payload];
    },
    renameEntity: (state, action) => {
      const { id, newName } = action.payload;
      state.entities = state.entities.map((entity) => {
        if (entity.id === id) {
          return {
            ...entity,
            name: newName,
          };
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

export const { setDrawMode, addEntity, renameEntity, deleteEntity, setEntites } = drawSlice.actions;

export default drawSlice.reducer;
