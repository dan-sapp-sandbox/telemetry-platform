import { useContext, useEffect, useMemo, type ReactNode } from "react";
import { Viewer, useCesium } from "resium";
import { CameraContext } from "./types";
import { Viewer as CesiumViewer, Cartesian3, ScreenSpaceEventType, IonImageryProvider, Color } from "cesium";
import useLocalStorage from "use-local-storage";
import DrawController from "./DrawController";

const RegisterMainViewer = () => {
  const { viewer } = useCesium();
  const { mainViewerRef } = useContext(CameraContext);

  useEffect(() => {
    if (!viewer) return;
    mainViewerRef.current = viewer as CesiumViewer;
  }, [viewer, mainViewerRef]);

  useEffect(() => {
    if (!viewer) return;

    let isCancelled = false;

    IonImageryProvider.fromAssetId(2).then((provider) => {
      if (isCancelled) return;

      viewer.imageryLayers.removeAll();
      viewer.imageryLayers.addImageryProvider(provider);
    });

    return () => {
      isCancelled = true;
    };
  }, [viewer]);

  return null;
};

const InitialCamera = () => {
  const [init] = useLocalStorage("main-cam-init-v7", {
    lat: 27.2,
    lon: 51.1,
    height: 1_500_000,
    heading: 0,
    pitch: -Math.PI / 2,
    roll: 0,
  });
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;

    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(init.lon, init.lat, init.height),
      orientation: {
        heading: init.heading,
        pitch: init.pitch,
        roll: init.roll,
      },
    });

    // viewer.resolutionScale = Math.min(window.devicePixelRatio, 1.5);
    viewer.resolutionScale = 1.0;
    // viewer.scene.globe.maximumScreenSpaceError = 5;
    // viewer.scene.globe.preloadSiblings = false;
    // viewer.scene.globe.preloadAncestors = false;
    // viewer.scene.globe.reprojectTextureFor3D = false;
    // viewer.scene.morphTo2D(0);
    viewer.scene.backgroundColor = Color.BLACK;
    viewer.scene.globe.baseColor = Color.BLACK;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }, [viewer]);

  return null;
};

const MainMap = ({ children }: { children?: ReactNode | ReactNode[] }) => {
  const { viewer } = useCesium();
  const contextOptions = useMemo(() => ({ webgl: { alpha: true, antialias: true, preserveDrawingBuffer: false } }), []);
  // const terrainProvider = createWorldTerrainAsync();

  useEffect(() => {
    if (!viewer) return;
    setTimeout(() => viewer.resize(), 0);
  }, [viewer]);

  return (
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
      requestRenderMode={false}
      maximumRenderTimeChange={Infinity}
    >
      <InitialCamera />
      <RegisterMainViewer />
      <DrawController />
      {children}
    </Viewer>
  );
};

export default MainMap;
