import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";

import mapReducer from "./slices/mapSlice";
import drawReducer from "./slices/drawSlice";
import reportReducer from "./slices/reportSlice";
import vesselReducer from "./slices/vesselSlice";
import aircraftReducer from "./slices/aircraftSlice";
import widgetReducer from "./slices/widgetSlice";
import actionPalletReducer from "./slices/actionPalletSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    draw: drawReducer,
    report: reportReducer,
    vessels: vesselReducer,
    aircraft: aircraftReducer,
    widget: widgetReducer,
    actionPallet: actionPalletReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
