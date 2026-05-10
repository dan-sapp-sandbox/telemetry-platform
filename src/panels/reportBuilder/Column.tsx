import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ReportSectionCard from "./ReportSectionCard";
import type { ReportSection } from "@/store/slices/reportSlice";

const Column = ({
  title,
  reportSections,
  handleUpdateReportSections,
}: {
  title?: string;
  reportSections: ReportSection[];
  handleUpdateReportSections: (newState: ReportSection[]) => void;
}) => {
  const handleUpdateSection = (updatedSection: ReportSection) => {
    const newReportState = reportSections.map((section) =>
      section.id === updatedSection.id ? { ...updatedSection, id: crypto.randomUUID() } : section,
    );
    handleUpdateReportSections(newReportState);
  };
  return (
    <div className="bg-(--column-bg) rounded md:rounded p-2 h-full lg:max-w-200">
      {title && (
        <h2 className="text-(--card-foreground) font-semibold text-sm md:text-lg mb-1 md:mb-4 w-full text-center">
          {title}
        </h2>
      )}

      <SortableContext items={reportSections.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 md:space-y-3 h-full overflow-y-auto scrollbar-hide">
          {reportSections.map((section) => (
            <ReportSectionCard key={section.id} section={section} handleUpdateSection={handleUpdateSection} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;
