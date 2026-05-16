import MainMap from "../map/MainMap";
import ContextMenu from "@/contextMenu/ContextMenu";
import Vessels from "../map/vessels/Vessels";
import Overlay from "./ui/Overlay";
import { useRef } from "react";
import useMapState from "@/map/hooks/useMapState";
import { CameraContext } from "@/map/types";

const SCMap = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { mainViewerRef, overviewViewerRef, pipViewerRef, pipViewer2Ref } = useMapState();
  const mapWrapperStyles = "relative w-full h-[calc(100%-23rem)] lg:h-[calc(100%-12rem)] xl:h-[calc(100%-17rem)]";
  return (
    <CameraContext.Provider value={{ containerRef, mainViewerRef, overviewViewerRef, pipViewerRef, pipViewer2Ref }}>
      <div className="relative h-full w-full cursor-pointer">
        <div className={mapWrapperStyles}>
          <MainMap>
            <Vessels />
            <ContextMenu />
          </MainMap>
        </div>
        <Overlay />
      </div>
    </CameraContext.Provider>
  );
};

export default SCMap;
