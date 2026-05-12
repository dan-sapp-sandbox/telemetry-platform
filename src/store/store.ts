import { configureStore } from "@reduxjs/toolkit";

import mapReducer from "./slices/mapSlice";
import drawReducer from "./slices/drawSlice";
import reportReducer from "./slices/reportSlice";
import vesselReducer from "./slices/vesselSlice";
import aircraftReducer from "./slices/aircraftSlice";
import widgetReducer from "./slices/widgetSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    draw: drawReducer,
    report: reportReducer,
    vessels: vesselReducer,
    aircraft: aircraftReducer,
    widget: widgetReducer,
  },
});
