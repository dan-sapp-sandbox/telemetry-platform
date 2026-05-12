import { createSlice } from "@reduxjs/toolkit";
import { type Descendant } from "slate";
import { initReportSections } from "../mockData/initReport";

export type SectionType = "image" | "text";

export interface ReportSection {
  id: string;
  type: SectionType;
  styles?: {
    [key: string]: string | number;
  };
  content?: Descendant[];
  imageUrl?: string;
}

export interface reportState {
  reportSections: ReportSection[];
}

const initialState: reportState = {
  reportSections: initReportSections,
};

const reportSlice = createSlice({
  name: "report",
  initialState,

  reducers: {
    addSectionToReport: (state, action) => {
      state.reportSections = [...state.reportSections, action.payload];
    },
    updateReportSections: (state, action) => {
      state.reportSections = action.payload;
    },
    clearReport: (state) => {
      state.reportSections = [];
    },
  },
});

export const { clearReport, updateReportSections, addSectionToReport } = reportSlice.actions;

export default reportSlice.reducer;
