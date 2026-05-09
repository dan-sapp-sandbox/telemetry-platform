import { DndContext, closestCorners, TouchSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import Column from "./Column";
import useReportBuilderState from "../../sections/reportBuilder/useReportBuilderState";
import { PDFViewer } from "@react-pdf/renderer";
import PdfPreview from "./PdfPreview";

const ReportBuilder = () => {
  //TODO: finish text editor
  //TODO: hide/show section
  //TODO: delete section

  const taskBoardState = useReportBuilderState();

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
        onDragStart={taskBoardState.handleDragStart}
        onDragEnd={taskBoardState.handleDragEnd}
        onDragCancel={taskBoardState.handleDragCancel}
      >
        <div className="w-full h-1/2 overflow-y-auto scrollbar-hide">
          <Column reportState={taskBoardState.reportState} setReportState={taskBoardState.setReportState} />
        </div>
      </DndContext>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <PdfPreview reportState={taskBoardState.reportState} />
      </PDFViewer>
    </div>
  );
};

export default ReportBuilder;
