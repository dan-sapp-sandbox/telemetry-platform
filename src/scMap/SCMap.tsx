import { useRef, useEffect } from "react";
import Layers from "@/map/Layers";
import MainMap from "@/map/MainMap";
import Vessels from "@/map/vessels/Vessels";
import Aircraft from "@/map/aircraft/Aircraft";
// import PipViewRectangle from "@/map/widgets/PipViewRectangle";
// import PipMap from "@/map/widgets/PipMap";
// import useWidgetLayout from "@/map/useWidgetLayout";
import useMapState from "@/map/useMapState";
import { CameraContext } from "@/map/types";
import ContextMenu from "@/contextMenu/ContextMenu";
import Overlay from "./ui/Overlay";
import { clock } from "@/map/simulationEngine";

const SCMap = () => {
  useEffect(() => {
    clock.start();
    return () => {
      clock.pause();
    };
  }, []);
  // const { handleDragStart, handleDragEnd, showOverviewMap, showPipMap, widgetLayout, containerRef } = useWidgetLayout();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { mainViewerRef, overviewViewerRef, pipViewerRef } = useMapState();
  const mapWrapperStyles = "relative w-full h-[calc(100%-21rem)] md:h-[calc(100%-12rem)] xl:h-[calc(100%-17rem)]";
  return (
    <CameraContext.Provider value={{ containerRef, mainViewerRef, overviewViewerRef, pipViewerRef }}>
      <div className="relative h-full w-full cursor-pointer">
        <div className={mapWrapperStyles}>
          <MainMap>
            {/* <PipViewRectangle show={showPipMap} /> */}
            <Vessels />
            <Aircraft />
            <ContextMenu />
            <Layers />
          </MainMap>
          {/* {showPipMap && (
            <PipMap pipState={widgetLayout.pip}>
              <Layers />
            </PipMap>
          )} */}
        </div>
        <Overlay />
      </div>
    </CameraContext.Provider>
  );
};

export default SCMap;
