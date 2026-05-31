import { createSlice } from "@reduxjs/toolkit";
import type { TabId } from "@/scMap/ui/centerPanel/useCenterPanel";

export interface TabState {
  tab: TabId;
}

const initialState: TabState = {
  tab: "about",
};

const tabSlice = createSlice({
  name: "Tab",
  initialState,

  reducers: {
    setTab: (state, action) => {
      state.tab = action.payload;
    },
  },
});

export const { setTab } = tabSlice.actions;

export default tabSlice.reducer;
