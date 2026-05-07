import { createContext, type RefObject } from "react";
import { Viewer } from "cesium";

type CameraContextType = {
  mainViewerRef: RefObject<Viewer | null>;
  overviewViewerRef: RefObject<Viewer | null>;
  pipViewerRef: RefObject<Viewer | null>;
  pipViewer2Ref: RefObject<Viewer | null>;
};

export const CameraContext = createContext<CameraContextType>({
  mainViewerRef: { current: null },
  overviewViewerRef: { current: null },
  pipViewerRef: { current: null },
  pipViewer2Ref: { current: null },
});

export interface IWidget {
  top: number;
  left: number;
  aspect: number;
  width: number;
}
export interface IWidgetState {
  overview: IWidget;
  pip: IWidget;
  pip2: IWidget;
}
