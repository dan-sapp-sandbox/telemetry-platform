import { configureStore } from "@reduxjs/toolkit";

import mapReducer from "./slices/mapSlice";
import drawReducer from "./slices/drawSlice";
import reportReducer from "./slices/reportSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    draw: drawReducer,
    report: reportReducer,
  },
});
