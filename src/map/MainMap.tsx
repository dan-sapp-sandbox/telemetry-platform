import { useContext, useEffect, useMemo, type ReactNode } from "react";
import { Viewer, useCesium } from "resium";
import { CameraContext } from "./types";
import { Viewer as CesiumViewer, Cartesian3, ScreenSpaceEventType, Color } from "cesium";
import useLocalStorage from "use-local-storage";
import DrawController from "./DrawController";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedVessel, type vesselState } from "@/store/slices/vesselSlice";
import { setActivePanel } from "@/store/slices/actionPalletSlice";
import { setSelectedEntity, type drawState } from "@/store/slices/drawSlice";
import { defaultMainView } from "./hooks/useMapState";

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
  const dispatch = useDispatch();
  const { vessels } = useSelector((state: { vessels: vesselState }) => state.vessels);
  const { entities } = useSelector((state: { draw: drawState }) => state.draw);
  const [init] = useLocalStorage("main-cam-init", defaultMainView);
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;
    setTimeout(() => viewer.resize(), 0);
  }, [viewer]);

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
    viewer.scene.morphTo2D(0);
    viewer.scene.backgroundColor = Color.BLACK;
    viewer.scene.globe.baseColor = Color.BLACK;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 9_000_000;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }, [viewer]);

  useEffect(() => {
    if (!viewer) return;
    const handler = viewer.screenSpaceEventHandler;

    handler.setInputAction((event: any) => {
      if (!vessels) return;
      const picked = viewer.scene.pick(event.position);
      const entity = picked?.id;
      if (!entity) {
        viewer.selectedEntity = undefined;
        return;
      }
      // intercept logic
      if (entity.properties?.type?.getValue() === "blocked") {
        return; // ignore selection
      }
      const entityId = entity.properties.id.getValue();
      const entityType = entity.properties.entityType.getValue();
      if (entityType === "vessel") {
        const matchingVessel = vessels.find((vessel) => vessel.id === entityId);
        if (!matchingVessel) return;
        dispatch(setSelectedVessel(matchingVessel));
        dispatch(setActivePanel("vessels"));
      }
      if (entityType === "draw") {
        const matchingEntity = entities.find((vessel) => vessel.id === entityId);
        if (!matchingEntity) return;
        dispatch(setSelectedEntity(matchingEntity));
        dispatch(setActivePanel("draw"));
      }
      // viewer.selectedEntity = entity;
    }, ScreenSpaceEventType.LEFT_CLICK);
  }, [viewer, vessels, entities]);

  return null;
};

const MainMap = ({ children }: { children?: ReactNode | ReactNode[] }) => {
  const contextOptions = useMemo(() => ({ webgl: { alpha: true } }), []);
  // const terrainProvider = createWorldTerrainAsync();

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
      infoBox={false}
      selectionIndicator={false}
    >
      <InitialCamera />
      <RegisterMainViewer />
      <DrawController />
      {children}
    </Viewer>
  );
};

export default MainMap;
