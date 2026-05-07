import { useContext, useEffect, useMemo, type ReactNode } from "react";
import { Grip } from "lucide-react";
import { Viewer, useCesium } from "resium";
import { CameraContext, type IWidget } from "./types";
import MainViewRectangle from "./MainViewRectangle";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const OverviewInitializer = () => {
  const { viewer } = useCesium();
  const { overviewViewerRef, mainViewerRef } = useContext(CameraContext);

  useEffect(() => {
    if (!viewer) return;
    overviewViewerRef.current = viewer;
  }, [viewer, overviewViewerRef]);

  useEffect(() => {
    if (!viewer) return;

    const position = mainViewerRef.current?.camera.position;
    if (position) {
      viewer.camera.setView({
        destination: position.clone(),
      });
    }

    const controller = viewer.scene.screenSpaceCameraController;
    controller.enableRotate = false;
    controller.enableZoom = false;
    controller.enableTilt = false;
    controller.enableTranslate = false;
    controller.enableLook = false;

    viewer.useDefaultRenderLoop = true;
    viewer.scene.requestRenderMode = false;
  }, [viewer, mainViewerRef]);

  return null;
};

const OverviewMap = ({ children, overviewState }: { children?: ReactNode | ReactNode[]; overviewState?: IWidget }) => {
  if (!overviewState) return null;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "overview",
  });
  const contextOptions = useMemo(() => ({ webgl: { alpha: true } }), []);
  return (
    <div
      style={{
        top: `${overviewState.top}%`,
        left: `${overviewState.left}%`,
        width: `${overviewState.width}%`,
        aspectRatio: overviewState.aspect,
        transform: CSS.Translate.toString(transform),
      }}
      className="group absolute border border-(--text) overflow-hidden"
      ref={setNodeRef}
    >
      <div className="z-999 w-full h-full relative">
        <div className="absolute top-0 w-full flex flex-row justify-center pointer-events-none">
          <div
            className="pointer-events-auto cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition rounded bg-black/70 p-1"
            {...listeners}
            {...attributes}
          >
            <Grip className="h-5 w-5 stroke-white" />
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
        <Viewer
          full
          contextOptions={contextOptions}
          baseLayerPicker={false}
          timeline={false}
          geocoder={false}
          homeButton={false}
          sceneModePicker={false}
          animation={false}
          fullscreenButton={false}
          navigationHelpButton={false}
          selectionIndicator={false}
          infoBox={false}
        >
          <OverviewInitializer />
          <MainViewRectangle />
          {children}
        </Viewer>
      </div>
    </div>
  );
};

export default OverviewMap;
