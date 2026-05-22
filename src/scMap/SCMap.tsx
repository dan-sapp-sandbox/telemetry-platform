import { useRef } from "react";
import Layers from "@/map/Layers";
import MainMap from "@/map/MainMap";
import Vessels from "@/map/vessels/Vessels";
import Aircraft from "@/map/aircraft/Aircraft";
import useMapState from "@/map/hooks/useMapState";
import { CameraContext } from "@/map/types";
import ContextMenu from "@/contextMenu/ContextMenu";
import Overlay from "./ui/Overlay";

const SCMap = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { mainViewerRef, overviewViewerRef, pipViewerRef } = useMapState();
  const mapWrapperStyles = "relative w-full h-[calc(100%-21rem)] md:h-[calc(100%-12rem)] xl:h-[calc(100%-17rem)]";
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
