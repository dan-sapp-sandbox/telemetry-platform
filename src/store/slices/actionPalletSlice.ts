import { createSlice } from "@reduxjs/toolkit";
import type { actionPanel } from "@/scMap/ui/actionPallet/utils";

export interface actionPallet {
  activePanel: actionPanel | null;
}

const initialState: actionPallet = {
  activePanel: null,
};

const actionPalletSlice = createSlice({
  name: "actionPallet",
  initialState,

  reducers: {
    setActivePanel: (state, action) => {
      state.activePanel = action.payload;
    },
  },
});

export const { setActivePanel } = actionPalletSlice.actions;

export default actionPalletSlice.reducer;
