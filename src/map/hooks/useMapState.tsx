import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Cartesian3, Cartographic, Math as CesiumMath, Viewer } from "cesium";
import type { ILayer, mapState } from "@/store/slices/mapSlice";
import useLocalStorage from "use-local-storage";
import { useSelector } from "react-redux";

export const defaultMainView = {
  heading: 6.283185307179581,
  height: 2000101.0682877784,
  lat: 29.927546494228835,
  lon: 54.599629924910886,
  pitch: -1.5682332501783933,
  roll: 0,
};
export const defaultPipView = {
  height: 7999.999999999899,
  lat: 29.240000000000006,
  lon: 50.314,
  heading: 6.283185307179581,
  pitch: -1.5684928999831915,
  roll: 0,
};
export const defaultPipView2 = {
  heading: 6.283185307179581,
  height: 11966.533380187617,
  lat: 35.69627462795138,
  lon: 51.38925863136245,
  pitch: -1.5684928999831915,
  roll: 0,
};

export interface IMapState {
  containerRef: RefObject<HTMLDivElement | null>;
  mainViewerRef: RefObject<Viewer | null>;
  overviewViewerRef: RefObject<Viewer | null>;
  pipViewerRef: RefObject<Viewer | null>;
  pipViewer2Ref: RefObject<Viewer | null>;
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
  const pipViewer2Ref = useRef<Viewer | null>(null);
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

        const mainCam = main.camera;

        const carto = Cartographic.fromCartesian(mainCam.position);
        const boostedHeight = Math.max(carto.height * 2, 3000000);

        const boostedPosition = Cartesian3.fromRadians(carto.longitude, carto.latitude, boostedHeight);

        setInitCameraView({
          lon: CesiumMath.toDegrees(carto.longitude),
          lat: CesiumMath.toDegrees(carto.latitude),
          height: carto.height,
          heading: mainCam.heading,
          pitch: mainCam.pitch,
          roll: mainCam.roll,
        });
        overview.camera.setView({
          destination: boostedPosition,
          orientation: {
            heading: 0,
            pitch: -Math.PI / 2,
            roll: 0,
          },
        });
      };

      main.camera.changed.addEventListener(sync);
      sync();

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
    pipViewer2Ref,
    layer,
    showOverviewMap,
    showPipMap,
    showPipMap2,
    containerRef,
  };
};

export default useMapState;
