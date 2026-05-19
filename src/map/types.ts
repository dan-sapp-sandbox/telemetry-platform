import { createContext, type RefObject } from "react";
import { Viewer } from "cesium";

type CameraContextType = {
  containerRef: RefObject<HTMLDivElement | null>;
  mainViewerRef: RefObject<Viewer | null>;
  overviewViewerRef: RefObject<Viewer | null>;
  pipViewerRef: RefObject<Viewer | null>;
};

export const CameraContext = createContext<CameraContextType>({
  containerRef: { current: null },
  mainViewerRef: { current: null },
  overviewViewerRef: { current: null },
  pipViewerRef: { current: null },
});
