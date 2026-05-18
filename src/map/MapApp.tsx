import { DndContext, TouchSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import MainMap from "./MainMap";
// import CameraControls from "./CameraControls";
import OverviewMap from "./widgets/OverviewMap";
import PipViewRectangle from "./widgets/PipViewRectangle";
import PipMap from "./widgets/PipMap";
import Layers from "./Layers";
import useMapState from "./hooks/useMapState";
import { CameraContext } from "./types";
import NavBar from "@/navBar/NavBar";
import { useTheme } from "@/components/themeToggle/useTheme";
import useWidgetLayout from "./hooks/useWidgetLayout";
// import useMapUtils from "./hooks/useMapUtils";
import ContextMenu from "@/contextMenu/ContextMenu";
import Vessels from "./vessels/Vessels";
import CommandBar from "@/commandBar/CommandBar";
// import DataLayer from "./DataLayer";

// TODO: mobile in general
// TODO: resize widgets
// TODO: compass
// TODO: finish send to report utility
// TODO: finish ai command layer

const MapApp = () => {
  const { theme, setTheme } = useTheme();
  const { handleDragStart, handleDragEnd, showOverviewMap, showPipMap, showPipMap2, widgetLayout, containerRef } =
    useWidgetLayout();
  const { mainViewerRef, overviewViewerRef, pipViewerRef, pipViewer2Ref, layer } = useMapState();
  // const {sendPrompt, Labels} = useMapUtils();
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
    <CameraContext.Provider value={{ containerRef, mainViewerRef, overviewViewerRef, pipViewerRef, pipViewer2Ref }}>
      <NavBar theme={theme} setTheme={setTheme} />
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
                <PipViewRectangle show={showPipMap} isPip2={false} />
                <PipViewRectangle show={showPipMap2} isPip2={true} />
                <Layers />
                {/* <DataLayer /> */}
                <Vessels />
                {/* <CameraControls /> */}
                {/* {Labels} */}
                <ContextMenu />
              </MainMap>
              {showOverviewMap && (
                <OverviewMap overviewState={widgetLayout.overview}>
                  <Layers />
                </OverviewMap>
              )}
              {showPipMap && (
                <PipMap pipState={widgetLayout.pip} isPip2={false}>
                  <Layers />
                </PipMap>
              )}
              {showPipMap2 && (
                <PipMap pipState={widgetLayout.pip2} isPip2={true}>
                  <Layers />
                </PipMap>
              )}
            </DndContext>
          </div>
        </div>
        <CommandBar />
      </div>
    </CameraContext.Provider>
  );
};

export default MapApp;
