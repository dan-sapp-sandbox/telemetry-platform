import { useContext, useEffect, useMemo, type ReactNode } from "react";
import { Grip } from "lucide-react";
import { Viewer, useCesium } from "resium";
import { CameraContext, type IWidget } from "./types";
import { Math, Cartographic, Cartesian3 } from "cesium";
// import { Math, Cartographic, Cartesian3, createWorldTerrainAsync } from "cesium";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import useLocalStorage from "use-local-storage";
import { defaultPipView, defaultPipView2 } from "./useMapState";
import { cn } from "@/lib/utils";

const PipInitializer = ({ isPip2 }: { isPip2: boolean }) => {
  const { viewer } = useCesium();
  const { pipViewerRef, pipViewer2Ref } = useContext(CameraContext);
  const pipRef = isPip2 ? pipViewer2Ref : pipViewerRef;
  const pipId = isPip2 ? "pip-2-cam-init" : "pip-cam-init";

  const defaultView = isPip2 ? defaultPipView2 : defaultPipView;
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

    // return () => {
    //   if (viewer && viewer.camera && viewer.camera.changed) {
    //     viewer.camera.changed.removeEventListener(onMove);
    //   }
    // };
  }, [viewer, setInit]);

  return null;
};

const PipMap = ({
  children,
  pipState,
  isPip2,
}: {
  children?: ReactNode | ReactNode[];
  pipState?: IWidget;
  isPip2: boolean;
}) => {
  if (!pipState) return;
  const pipId = isPip2 ? "pip-2" : "pip";
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: pipId,
  });
  const contextOptions = useMemo(() => ({ webgl: { alpha: true } }), []);
  // const terrainProvider = createWorldTerrainAsync();
  return (
    <div
      style={{
        top: `${pipState.top}%`,
        left: `${pipState.left}%`,
        width: `${pipState.width}%`,
        aspectRatio: pipState.aspect,
        transform: CSS.Translate.toString(transform),
      }}
      className={cn(
        "group absolute rounded border overflow-hidden",
        isPip2 ? "border-(--pip-2-border)" : "border-(--pip-border)",
      )}
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
          <PipInitializer isPip2={isPip2} />
          {children}
        </Viewer>
      </div>
    </div>
  );
};

export default PipMap;
