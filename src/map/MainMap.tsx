import { useContext, useEffect, useMemo, type ReactNode } from "react";
import { Viewer, useCesium } from "resium";
import { CameraContext } from "./types";
// import { Viewer as CesiumViewer, Cartesian3, createWorldTerrainAsync } from "cesium";
import { Viewer as CesiumViewer, Cartesian3 } from "cesium";
import useLocalStorage from "use-local-storage";

const RegisterMainViewer = () => {
  const { viewer } = useCesium();
  const { mainViewerRef } = useContext(CameraContext);

  useEffect(() => {
    if (!viewer) return;
    mainViewerRef.current = viewer as CesiumViewer;
  }, [viewer, mainViewerRef]);

  return null;
};

const InitialCamera = () => {
  const [init] = useLocalStorage("main-cam-init", {
    lat: 42,
    lon: 0,
    height: 2_000_000,
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
  }, [viewer]);

  return null;
};

const MainMap = ({ children }: { children?: ReactNode | ReactNode[] }) => {
  const { viewer } = useCesium();
  const contextOptions = useMemo(() => ({ webgl: { alpha: true } }), []);
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
      timeline={false}
      geocoder={false}
      homeButton={false}
      sceneModePicker={false}
      animation={false}
      fullscreenButton={false}
      navigationHelpButton={false}
    >
      <InitialCamera />
      <RegisterMainViewer />
      {children}
    </Viewer>
  );
};

export default MainMap;
