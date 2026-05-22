import { DndContext, TouchSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import MainMap from "./MainMap";
import OverviewMap from "./widgets/OverviewMap";
import PipViewRectangle from "./widgets/PipViewRectangle";
import PipMap from "./widgets/PipMap";
import Layers from "./Layers";
import useMapState from "./hooks/useMapState";
import { CameraContext } from "./types";
import useWidgetLayout from "./hooks/useWidgetLayout";
import ContextMenu from "@/contextMenu/ContextMenu";
import Vessels from "./vessels/Vessels";

const MapApp = () => {
  const { handleDragStart, handleDragEnd, showOverviewMap, showPipMap, widgetLayout, containerRef } = useWidgetLayout();
  const { mainViewerRef, overviewViewerRef, pipViewerRef } = useMapState();
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
    <CameraContext.Provider value={{ containerRef, mainViewerRef, overviewViewerRef, pipViewerRef }}>
      <div className="flex flex-col w-full h-full">
        <div className="flex w-full h-full">
          <div ref={containerRef} className="relative h-full w-full overflow-hidden cursor-pointer">
            <DndContext
              sensors={sensors}
              modifiers={[restrictToParentElement]}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <MainMap>
                <PipViewRectangle show={showPipMap} />
                <Layers />
                <Vessels />
                {/* <CameraControls /> */}
                <ContextMenu />
              </MainMap>
              {showOverviewMap && (
                <OverviewMap overviewState={widgetLayout.overview}>
                  <Layers />
                </OverviewMap>
              )}
              {showPipMap && (
                <PipMap pipState={widgetLayout.pip}>
                  <Layers />
                </PipMap>
              )}
            </DndContext>
          </div>
        </div>
      </div>
    </CameraContext.Provider>
  );
};

export default MapApp;
