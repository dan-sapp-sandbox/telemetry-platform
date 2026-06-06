import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Cartesian3, Math as CesiumMath, Viewer } from "cesium";
import type { ILayer, mapState } from "@/store/slices/mapSlice";
import useLocalStorage from "use-local-storage";
import { useSelector } from "react-redux";

export const defaultMainView = {
  heading: 0,
  height: 70_000,
  lat: 40.5,
  lon: -74,
  pitch: -Math.PI / 2,
  roll: 0,
};
export const defaultPipView = {
  height: 8000,
  lat: 30,
  lon: 50,
  heading: 0,
  pitch: -Math.PI / 2,
  roll: 0,
};

export interface IMapState {
  containerRef: RefObject<HTMLDivElement | null>;
  mainViewerRef: RefObject<Viewer | null>;
  overviewViewerRef: RefObject<Viewer | null>;
  pipViewerRef: RefObject<Viewer | null>;
  layer: ILayer;
  showOverviewMap: boolean;
  showPipMap: boolean;
  showPipMap2: boolean;
}

const useMapState = (): IMapState => {
  const { showOverviewMap, showPipMap, showPipMap2, layer, trackedEntityId } = useSelector(
    (state: { map: mapState }) => state.map,
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mainViewerRef = useRef<Viewer | null>(null);
  const overviewViewerRef = useRef<Viewer | null>(null);
  const pipViewerRef = useRef<Viewer | null>(null);
  const [_init, setInitCameraView] = useLocalStorage("main-cam-init", defaultMainView);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const tryAttach = () => {
      const main = mainViewerRef.current;
      const overview = overviewViewerRef.current;

      if (!main || !overview) {
        requestAnimationFrame(tryAttach);
        return;
      }

      const sync = () => {
        const main = mainViewerRef.current;
        const overview = overviewViewerRef.current;

        if (!main || !overview) return;

        const camera = main.camera;

        const position = camera.positionCartographic;

        const destination = Cartesian3.fromRadians(
          position.longitude,
          position.latitude,
          Math.min(7_000_000, Math.max(position.height * 2.2, 1_500_000)),
        );

        overview.camera.setView({
          destination,
          orientation: {
            heading: 0,
            pitch: -Math.PI / 2,
            roll: 0,
          },
        });

        if (!trackedEntityId) {
          setInitCameraView({
            lon: CesiumMath.toDegrees(position.longitude),
            lat: CesiumMath.toDegrees(position.latitude),
            height: position.height,
            heading: camera.heading,
            pitch: camera.pitch,
            roll: camera.roll,
          });
        }
      };

      try {
        main.camera.changed.addEventListener(sync);
        sync();
      } catch (e) {
        console.log("e", e);
      }

      cleanup = () => {
        main.camera.changed.removeEventListener(sync);
      };
    };

    tryAttach();

    return () => {
      cleanup?.();
    };
  }, []);

  return {
    mainViewerRef,
    overviewViewerRef,
    pipViewerRef,
    layer,
    showOverviewMap,
    showPipMap,
    showPipMap2,
    containerRef,
  };
};

export default useMapState;
