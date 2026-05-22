import { useContext, useEffect, useMemo, type ReactNode } from "react";
import { Grip } from "lucide-react";
import { Viewer, useCesium } from "resium";
import { CameraContext } from "../types";
import type { IWidget } from "@/store/slices/widgetSlice";
import { Math, Cartographic, Cartesian3 } from "cesium";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import useLocalStorage from "use-local-storage";
import { defaultPipView } from "../useMapState";
import { cn } from "@/lib/utils";

const PipInitializer = () => {
  const { viewer } = useCesium();
  const { pipViewerRef } = useContext(CameraContext);
  const pipRef = pipViewerRef;
  const pipId = "pip-cam-init";

  const defaultView = defaultPipView;
  const [init, setInit] = useLocalStorage(pipId, defaultView);

  useEffect(() => {
    if (!viewer || !viewer?.scene || !viewer?.camera) return;
    pipRef.current = viewer;
  }, [viewer, pipRef]);

  useEffect(() => {
    try {
      if (!viewer || !viewer?.scene || !viewer?.camera) return;

      viewer.camera.setView({
        destination: Cartesian3.fromDegrees(init.lon, init.lat, init.height),
        orientation: {
          heading: init.heading,
          pitch: init.pitch,
          roll: init.roll,
        },
      });
    } catch (e) {
      console.log("e", e);
    }
  }, [viewer]);

  useEffect(() => {
    if (!viewer || !viewer?.scene || !viewer?.camera) return;

    let frame = 0;

    const onMove = () => {
      if (frame++ % 10 !== 0) return;

      const camera = viewer.camera;
      const carto = Cartographic.fromCartesian(camera.position);

      setInit({
        lon: Math.toDegrees(carto.longitude),
        lat: Math.toDegrees(carto.latitude),
        height: carto.height,
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll,
      });
    };

    viewer?.camera?.changed?.addEventListener(onMove);

    return () => {
      try {
        const camChanged = viewer?.camera?.changed;
        if (camChanged) camChanged.removeEventListener(onMove);
      } catch (e) {
        console.log("e", e);
      }
    };
  }, [viewer, setInit]);

  return null;
};

const PipMap = ({ children, pipState }: { children?: ReactNode | ReactNode[]; pipState?: IWidget }) => {
  if (!pipState) return;
  const pipId = "pip";
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: pipId,
  });
  const contextOptions = useMemo(() => ({ webgl: { alpha: true } }), []);
  return (
    <div
      style={{
        top: `${pipState.top}%`,
        left: `${pipState.left}%`,
        width: `${pipState.width}%`,
        aspectRatio: pipState.aspect,
        transform: CSS.Translate.toString(transform),
      }}
      className={cn("group absolute rounded border overflow-hidden", "border-(--pip-border)")}
      ref={setNodeRef}
    >
      <div className="z-999 w-full h-full relative pointer-events-none">
        <div className="absolute top-0 w-full flex flex-row justify-center">
          <div
            className="pointer-events-auto cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 rounded bg-black/70 p-1"
            {...listeners}
            {...attributes}
          >
            <Grip className="h-5 w-5 stroke-white" />
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 h-full w-full pointer-events-auto">
        <Viewer
          full
          // terrainProvider={terrainProvider}
          contextOptions={contextOptions}
          baseLayerPicker={false}
          baseLayer={false}
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
          <PipInitializer />
          {children}
        </Viewer>
      </div>
    </div>
  );
};

export default PipMap;
