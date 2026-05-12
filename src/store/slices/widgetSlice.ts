import { createSlice } from "@reduxjs/toolkit";

export interface IWidget {
  top: number;
  left: number;
  aspect: number;
  width: number;
}
export interface WidgetLayout {
  overview: IWidget;
  pip: IWidget;
  pip2: IWidget;
}

const initWidgetState: WidgetLayout = {
  overview: {
    top: 65,
    left: 2,
    width: 20,
    aspect: 1,
  },
  pip: {
    left: 11.2,
    top: 22.5,
    width: 12,
    aspect: 3 / 4,
  },
  pip2: {
    left: 66.24074074074075,
    top: 16.48863636363636,
    width: 30,
    aspect: 4 / 3,
  },
};

export interface IWidgetState {
  widgetLayout: WidgetLayout;
}

const initialState: IWidgetState = {
  widgetLayout: initWidgetState,
};

const widgetSlice = createSlice({
  name: "widget",
  initialState,

  reducers: {
    updateWidgetState: (state, action) => {
      state.widgetLayout = action.payload;
    },
  },
});

export const { updateWidgetState } = widgetSlice.actions;

export default widgetSlice.reducer;
