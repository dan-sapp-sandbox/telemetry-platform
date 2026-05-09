import { useState, type ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { type Descendant } from "slate";
import { initialReportState } from "./initReport";

export interface ReportSection {
  id: string;
  type: string;
  styles?: {
    [key: string]: string | number;
  };
  content?: Descendant[];
  pdfContent?: ReactNode;
  imageUrl?: string;
}

export interface IReportBuilder {
  reportState: ReportSection[];
  setReportState: Dispatch<SetStateAction<ReportSection[]>>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragCancel: () => void;
  activeSection: ReportSection | null;
}

const useReportBuilder = (): IReportBuilder => {
  const [reportState, setReportState] = useState<ReportSection[]>(initialReportState);
  const [activeSection, setActiveSection] = useState<ReportSection | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const sectionId = event.active.id as string;
    const matchingSection = reportState.find((s) => s.id === sectionId) || null;
    setActiveSection(matchingSection);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveSection(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const oldIndex = reportState.findIndex((item) => item.id === activeId);
    const newIndex = reportState.findIndex((item) => item.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    setReportState((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const handleDragCancel = () => setActiveSection(null);

  return {
    reportState,
    setReportState,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    activeSection,
  };
};

export default useReportBuilder;
