import { useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Viewer, useCesium } from "resium";
import { CameraContext } from "./types";
import { Viewer as CesiumViewer, Cartesian3, ScreenSpaceEventType, Color, SunLight } from "cesium";
import useLocalStorage from "use-local-storage";
import DrawController from "./DrawController";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedVessel, type vesselState } from "@/store/slices/vesselSlice";
import { setSelectedAircraft, type AircraftState } from "@/store/slices/aircraftSlice";
import { setTab } from "@/store/slices/tabSlice";
import { setSelectedEntity, type drawState } from "@/store/slices/drawSlice";
import { defaultMainView } from "./useMapState";
import type { mapState } from "@/store/slices/mapSlice";
import type { Aircraft, AircraftMap, AISVessel } from "@/store/services/api";

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
  const { trackedEntityId } = useSelector((state: { map: mapState }) => state.map);
  const { aircraftMap } = useSelector((state: { aircraft: AircraftState }) => state.aircraft);
  const { vessels } = useSelector((state: { vessels: vesselState }) => state.vessels);
  const { entities } = useSelector((state: { draw: drawState }) => state.draw);
  const [init] = useLocalStorage("main-cam-init", defaultMainView);
  const { viewer } = useCesium();

  useEffect(() => {
    if (!viewer) return;
    setTimeout(() => viewer.resize(), 0);
  }, [viewer]);

  const vesselsRef = useRef<AISVessel[]>(null);
  useEffect(() => {
    vesselsRef.current = vessels;
  }, [vessels]);

  const aircraftMapRef = useRef<AircraftMap>(null);
  useEffect(() => {
    aircraftMapRef.current = aircraftMap;
  }, [aircraftMap]);

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
    viewer.scene.light = new SunLight();
    viewer.scene.globe.enableLighting = false;
    // viewer.scene.globe.maximumScreenSpaceError = 5;
    // viewer.scene.globe.preloadSiblings = false;
    // viewer.scene.globe.preloadAncestors = false;
    // viewer.scene.globe.reprojectTextureFor3D = false;
    // viewer.scene.morphTo2D(0);
    viewer.scene.backgroundColor = Color.BLACK;
    viewer.scene.globe.baseColor = Color.BLACK;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 9_000_000;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }, [viewer]);

  useEffect(() => {
    if (!viewer) return;

    if (!trackedEntityId) {
      viewer.trackedEntity = undefined;
      return;
    }

    let frame: number;

    const tryTrack = () => {
      if (!viewer || viewer.isDestroyed()) return;

      const entity =
        viewer.entities.getById(trackedEntityId) ?? viewer.dataSources.get(0)?.entities.getById(trackedEntityId);

      if (entity) {
        viewer.trackedEntity = entity;
        return;
      }

      frame = requestAnimationFrame(tryTrack);
    };

    tryTrack();

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [viewer, trackedEntityId]);

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

      if (entity.properties?.type === "blocked") {
        return;
      }

      const entityType = entity.properties.entityType.getValue();
      if (entityType === "vessel") {
        const entityId = entity.properties.mmsi.getValue();
        const matchingVessel = vesselsRef.current?.find((vessel) => vessel.mmsi === entityId);
        if (!matchingVessel) return;
        dispatch(setSelectedVessel(matchingVessel));
        dispatch(setTab("vessels"));
      }
      if (entityType === "aircraft") {
        const entityId = entity.properties.icao.getValue();
        const matchingAircraftSnapshots = aircraftMapRef.current?.[entityId];
        if (!matchingAircraftSnapshots) return;
        const matchingAircraft = matchingAircraftSnapshots[matchingAircraftSnapshots.length - 1];
        if (!matchingAircraft) return;
        dispatch(setSelectedAircraft(matchingAircraft as Aircraft));
        dispatch(setTab("aircraft"));
      }
      if (entityType === "draw") {
        const entityId = entity.properties.id.getValue();
        const matchingEntity = entities.find((vessel) => vessel.id === entityId);
        if (!matchingEntity) return;
        dispatch(setSelectedEntity(matchingEntity));
        dispatch(setTab("draw"));
      }
      // viewer.selectedEntity = entity;
    }, ScreenSpaceEventType.LEFT_CLICK);
  }, [viewer, vessels, entities]);

  return null;
};

const MainMap = ({ children }: { children?: ReactNode | ReactNode[] }) => {
  const contextOptions = useMemo(() => ({ webgl: { alpha: true } }), []);

  return (
    <Viewer
      full
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
