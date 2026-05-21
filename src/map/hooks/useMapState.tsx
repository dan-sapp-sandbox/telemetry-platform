import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Cartesian2, Cartesian3, Cartographic, Math as CesiumMath, Viewer } from "cesium";
import type { ILayer, mapState } from "@/store/slices/mapSlice";
import useLocalStorage from "use-local-storage";
import { useSelector } from "react-redux";

export const defaultMainView = {
  heading: 0,
  height: 9_000_000,
  lat: 27.75,
  lon: 53.37,
  pitch: -Math.PI / 2,
  roll: 0,
};
export const defaultPipView = {
  height: 7999.999999999899,
  lat: 29.240000000000006,
  lon: 50.314,
  heading: 6.283185307179581,
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
  const { showOverviewMap, showPipMap, showPipMap2, layer } = useSelector((state: { map: mapState }) => state.map);

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

        const scene = main.scene;
        const camera = main.camera;

        const center = new Cartesian2(scene.canvas.clientWidth / 2, scene.canvas.clientHeight / 2);

        const ellipsoid = scene.globe.ellipsoid;

        const cartesian = camera.pickEllipsoid(center, ellipsoid);

        if (!cartesian) return;

        const carto = Cartographic.fromCartesian(cartesian);

        const overviewHeight = Math.min(8_000_000, Math.max(camera.positionCartographic.height * 2, 3_000_000));

        const destination = Cartesian3.fromRadians(carto.longitude, carto.latitude, overviewHeight);

        setInitCameraView({
          lon: CesiumMath.toDegrees(camera.positionCartographic.longitude),
          lat: CesiumMath.toDegrees(camera.positionCartographic.latitude),
          height: camera.positionCartographic.height,
          heading: 0,
          pitch: -Math.PI / 2,
          roll: 0,
        });

        overview.camera.setView({
          destination,
          orientation: {
            heading: 0,
            pitch: -Math.PI / 2,
            roll: 0,
          },
        });
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
