import { useState, type MouseEvent, type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Grip } from "lucide-react";
import { type ReportSection } from "@/store/slices/reportSlice";
import TextEditor from "@/components/textEditor";
import type { Descendant } from "slate";

const ReportSectionCard = ({
  section,
  handleUpdateSection,
}: {
  section: ReportSection;
  handleUpdateSection: (updatedSection: ReportSection) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleSectionClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const onBlurUpdate = (newVal: Descendant[]) => {
    handleUpdateSection({
      ...section,
      content: newVal,
    });
  };

  const getPreview = (section: ReportSection) => {
    switch (section.type) {
      case "text":
        if (!section.content) return <div>Error</div>;
        return <TextEditor readOnly value={section.content} onBlurUpdate={onBlurUpdate} />;
      case "image":
        return <img className="h-20" src={section.imageUrl} />;
      default:
        return <div>Error</div>;
    }
  };
  const getEditor = (section: ReportSection) => {
    switch (section.type) {
      case "text":
        if (!section.content) return <div>Error</div>;
        return <TextEditor value={section.content} onBlurUpdate={onBlurUpdate} />;
      case "image":
        return <img className="w-full" src={section.imageUrl} />;
      default:
        return <div>Error</div>;
    }
  };

  const sectionDisplay: ReactNode = isExpanded ? getEditor(section) : getPreview(section);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "p-2 md:py-4 md:px-2 rounded-xl border shadow-sm gap-2 flex flex-row justify-between",
        "bg-(--background) border-(--border-alt) text-(--text) overflow-hidden w-full",
        isDragging ? "opacity-80" : "",
      )}
    >
      <div {...listeners} className="cursor-grab active:cursor-grabbing flex justify-center items-center">
        <Grip className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 flex flex-row justify-between">
        <div className="min-w-0 flex-1 flex">{sectionDisplay}</div>
        <div className="cursor-pointer" onClick={handleSectionClick}>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>
    </div>
  );
};

export default ReportSectionCard;
