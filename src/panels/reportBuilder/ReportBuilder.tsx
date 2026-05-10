import { DndContext, closestCorners, TouchSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import Column from "./Column";
import useReportBuilder from "./useReportBuilder";
import { PDFViewer } from "@react-pdf/renderer";
import PdfPreview from "./PdfPreview";

const ReportBuilder = () => {
  //TODO: finish text editor
  //TODO: hide/show section
  //TODO: delete section
  //TODO: fix serializing issue with redux

  const {
    handleDragCancel,
    handleUpdateReportSections,
    // handleClearReport,
    handleDragEnd,
    handleDragStart,
    reportSections,
  } = useReportBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  return (
    <div className="relative h-full w-full flex flex-col justify-between gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="w-full h-1/2 overflow-y-auto scrollbar-hide">
          <Column reportSections={reportSections} handleUpdateReportSections={handleUpdateReportSections} />
        </div>
      </DndContext>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <PdfPreview reportSections={reportSections} />
      </PDFViewer>
    </div>
  );
};

export default ReportBuilder;
