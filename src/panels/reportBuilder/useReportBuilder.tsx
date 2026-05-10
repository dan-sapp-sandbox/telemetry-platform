import { useState } from "react";
// import type { Dispatch, SetStateAction } from "react";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useSelector, useDispatch } from "react-redux";
import { updateReportSections, clearReport, type ReportSection, type reportState } from "@/store/slices/reportSlice";

export interface IReportBuilder {
  reportSections: ReportSection[];
  handleUpdateReportSections: (newReportSections: ReportSection[]) => void;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
  handleClearReport: () => void;
  activeSection: ReportSection | null;
}

const useReportBuilder = (): IReportBuilder => {
  const dispatch = useDispatch();
  const { reportSections } = useSelector((state: { report: reportState }) => state.report);
  const [activeSection, setActiveSection] = useState<ReportSection | null>(null);

  const handleUpdateReportSections = (newReportSections: ReportSection[]) => {
    dispatch(updateReportSections(newReportSections));
  };
  const handleClearReport = () => {
    dispatch(clearReport());
  };

  const handleDragStart = (event: DragStartEvent) => {
    const sectionId = event.active.id as string;
    const matchingSection = reportSections.find((s) => s.id === sectionId) || null;
    setActiveSection(matchingSection);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveSection(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const oldIndex = reportSections.findIndex((item) => item.id === activeId);
    const newIndex = reportSections.findIndex((item) => item.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const newReportSections = arrayMove(reportSections, oldIndex, newIndex);
    handleUpdateReportSections(newReportSections);
  };

  const handleDragCancel = () => setActiveSection(null);

  return {
    reportSections,
    handleUpdateReportSections,
    handleClearReport,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    activeSection,
  };
};

export default useReportBuilder;
