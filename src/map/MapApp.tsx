import { DndContext, TouchSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import MainMap from "./MainMap";
// import CameraControls from "./CameraControls";
import OverviewMap from "./OverviewMap";
import PipViewRectangle from "./PipViewRectangle";
import PipMap from "./PipMap";
import Layers from "./Layers";
import useMapState from "./useMapState";
import { CameraContext } from "./types";
import NavBar from "@/navBar/NavBar";
import { useTheme } from "@/components/themeToggle/useTheme";

// TODO: icons
// TODO: right click context menu
// TODO: mobile in general
// TODO: resize widgets
// TODO: compass
// TODO: finish send to report utility
// TODO: finish ai command layer

const MapApp = () => {
  const { theme, setTheme } = useTheme();
  const mapState = useMapState();
  const {
    mainViewerRef,
    overviewViewerRef,
    pipViewerRef,
    pipViewer2Ref,
    handleDragStart,
    handleDragEnd,
    layer,
    showOverviewMap,
    showPipMap,
    showPipMap2,
    widgetState,
    containerRef,
    // Labels,
  } = mapState;
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
    <CameraContext.Provider value={{ mainViewerRef, overviewViewerRef, pipViewerRef, pipViewer2Ref }}>
      <NavBar theme={theme} setTheme={setTheme} />
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
            <Layers layer={layer} />
            {/* <CameraControls /> */}
            {/* {Labels} */}
          </MainMap>
          {showOverviewMap && (
            <OverviewMap overviewState={widgetState.overview}>
              <Layers layer={layer} />
            </OverviewMap>
          )}
          {showPipMap && (
            <PipMap pipState={widgetState.pip} isPip2={false}>
              <Layers layer={layer} />
            </PipMap>
          )}
          {showPipMap2 && (
            <PipMap pipState={widgetState.pip2} isPip2={true}>
              <Layers layer={layer} />
            </PipMap>
          )}
        </DndContext>
      </div>
    </CameraContext.Provider>
  );
};

export default MapApp;
