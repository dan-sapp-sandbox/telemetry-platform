import { useState, useContext, useEffect, useMemo, useRef, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cartesian3 } from "cesium";

import VesselEntity from "./VesselEntity";
import { CameraContext, type ProcessedRoute, type SimulatedVessel } from "@/map/types";
import { processRoute, getPositionAlongRoute } from "@/map/utils";
import { useGetRoutesQuery, useGetVesselsQuery } from "@/store/services/api";
import { setVessels, type vesselState } from "@/store/slices/vesselSlice";
import { type PlaybackState } from "@/store/slices/playbackSlice";
import { clock } from "@/map/simulationEngine";

export interface IVesselState {
  vesselEntities: JSX.Element[];
  showVessels: boolean;
}

const useVessels = (): IVesselState => {
  const dispatch = useDispatch();
  const [, forceRender] = useState(0);

  const { showVessels, showVesselNames, selectedVessel } = useSelector(
    (state: { vessels: vesselState }) => state.vessels,
  );

  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const { mainViewerRef } = useContext(CameraContext);

  const { data: routedVessels = [] } = useGetVesselsQuery(undefined, {
    skip: !mainViewerRef.current,
  });

  const { data: routes = [] } = useGetRoutesQuery(undefined, {
    skip: !mainViewerRef.current,
  });

  useEffect(() => {
    let frame: number;

    const tick = () => {
      forceRender((x) => x + 1);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isPlaying) clock.play();
    else clock.pause();

    clock.setSpeed(speed);
  }, [isPlaying, speed]);

  const processedRoutes = useMemo(() => {
    return routes.reduce<Record<string, ProcessedRoute>>((acc, route) => {
      acc[route.id] = processRoute(route);
      return acc;
    }, {});
  }, [routes]);

  const simTimeMs = clock.getTime();

  const visibleVessels = useMemo(() => {
    const viewer = mainViewerRef.current;
    if (!viewer) return [];

    const camera = viewer.camera;

    return routedVessels
      .map((vessel) => {
        const route = processedRoutes[vessel.routeId];
        if (!route || route.totalDistance <= 0) return null;

        const elapsedSeconds = vessel.startOffsetSeconds + simTimeMs / 1000;

        const distance = vessel.routeOffsetMeters + elapsedSeconds * vessel.speedMps;

        const wrapped = ((distance % route.totalDistance) + route.totalDistance) % route.totalDistance;

        const { heading, position } = getPositionAlongRoute(route, wrapped);

        const distanceToCamera = Cartesian3.distance(camera.positionWC, position);

        const visible = distanceToCamera < camera.frustum.far && camera.frustum.near < distanceToCamera;

        if (!visible) return null;

        return {
          ...vessel,
          route,
          position,
          heading,
        };
      })
      .filter((v): v is SimulatedVessel => v !== null);
  }, [routedVessels, processedRoutes, simTimeMs, mainViewerRef.current]);

  // sync redux UI list
  const previousIdsRef = useRef("");

  useEffect(() => {
    const ids = visibleVessels.map((v) => v.id).join(",");

    if (ids === previousIdsRef.current) return;

    previousIdsRef.current = ids;

    dispatch(
      setVessels(
        visibleVessels.map((vessel) => ({
          id: vessel.id,
          name: vessel.name,
          routeName: vessel.route.name,
        })),
      ),
    );
  }, [dispatch, visibleVessels]);

  // render entities
  const vesselEntities = useMemo(() => {
    return visibleVessels.map((vessel) => {
      const isSelected = selectedVessel?.id === vessel.id;

      return <VesselEntity key={vessel.id} vessel={vessel} showVesselNames={showVesselNames} isSelected={isSelected} />;
    });
  }, [visibleVessels, showVesselNames, selectedVessel]);

  return {
    vesselEntities,
    showVessels,
  };
};

export default useVessels;
