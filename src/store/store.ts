import { configureStore } from "@reduxjs/toolkit";

import mapReducer from "./slices/mapSlice";
import drawReducer from "./slices/drawSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    draw: drawReducer,
  },
});
