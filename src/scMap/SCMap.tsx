import { useRef, useEffect } from "react";
import Layers from "@/map/layers/Layers";
import MainMap from "@/map/MainMap";
import Vessels from "@/map/vessels/Vessels";
import Aircraft from "@/map/aircraft/Aircraft";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { mainViewerRef, overviewViewerRef, pipViewerRef } = useMapState();
  const mapWrapperStyles = "relative w-full h-[calc(100%-22.5rem)] md:h-[calc(100%-12rem)] xl:h-[calc(100%-17rem)]";
  return (
    <CameraContext.Provider value={{ containerRef, mainViewerRef, overviewViewerRef, pipViewerRef }}>
      <div className="relative h-full w-full cursor-pointer">
        <div className={mapWrapperStyles}>
          <MainMap>
            <Vessels />
            <Aircraft />
            <ContextMenu />
            <Layers />
          </MainMap>
        </div>
        <Overlay />
      </div>
    </CameraContext.Provider>
  );
};

export default SCMap;
