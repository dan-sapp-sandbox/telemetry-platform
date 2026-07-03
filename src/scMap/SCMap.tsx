import { useRef, useEffect } from "react";
import Layers from "@/scMap/layers/Layers";
import MainMap from "@/scMap/MainMap";
import Vessels from "@/scMap/vessels/Vessels";
import Aircraft from "@/scMap/aircraft/Aircraft";
import useMapState from "@/scMap/useMapState";
import { CameraContext } from "@/scMap/types";
import ContextMenu from "@/components/contextMenu/ContextMenu";
import Overlay from "./ui/Overlay";
import { clock } from "@/scMap/simulationEngine";
import OceanLayer from "./ocean/OceanLayer";

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
            <OceanLayer />
          </MainMap>
        </div>
        <Overlay />
      </div>
    </CameraContext.Provider>
  );
};

export default SCMap;
