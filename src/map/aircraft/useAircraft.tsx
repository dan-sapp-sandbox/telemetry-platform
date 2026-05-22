import { useState, useContext, useEffect, useMemo, useRef, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cartographic, Math as CesiumMath } from "cesium";
import AircraftEntity from "./AircraftEntity";
import { CameraContext, type ProcessedRoute, type SimulatedAircraft } from "@/map/types";
import { getBounds, processRoute, getPositionAlongRoute } from "@/map/utils";
import { useGetAirRoutesQuery, useGetAircraftQuery, type IBounds } from "@/store/services/api";
import { setAircraft, type aircraftState } from "@/store/slices/aircraftSlice";
import { type PlaybackState } from "@/store/slices/playbackSlice";
import { clock } from "@/map/simulationEngine";

export interface IAircraftState {
  aircraftEntities: JSX.Element[];
  showAircraft: boolean;
}

const useAircraft = (): IAircraftState => {
  const dispatch = useDispatch();

  const [, forceRender] = useState(0);

  const { showAircraft, showAircraftNames, selectedAircraft } = useSelector(
    (state: { aircraft: aircraftState }) => state.aircraft,
  );

  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const { mainViewerRef } = useContext(CameraContext);

  const boundsRef = useRef<IBounds | null>(null);

  const { data: routedAircraft = [] } = useGetAircraftQuery(undefined, {
    skip: !mainViewerRef.current,
  });

  const { data: routes = [] } = useGetAirRoutesQuery(undefined, {
    skip: !mainViewerRef.current,
  });

  // start render ticker
  useEffect(() => {
    let frame: number;

    const tick = () => {
      forceRender((x) => x + 1);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  // sync redux playback -> simulation clock
  useEffect(() => {
    if (isPlaying) {
      clock.play();
    } else {
      clock.pause();
    }

    clock.setSpeed(speed);
  }, [isPlaying, speed]);

  // processed routes
  const processedRoutes = useMemo(() => {
    return routes.reduce<Record<string, ProcessedRoute>>((acc, route) => {
      acc[route.id] = processRoute(route);
      return acc;
    }, {});
  }, [routes]);

  // camera bounds tracking
  useEffect(() => {
    if (!mainViewerRef.current) return;

    const updateBounds = () => {
      if (!mainViewerRef.current) return;

      boundsRef.current = getBounds(mainViewerRef.current);
    };

    updateBounds();

    const camera = mainViewerRef.current.camera;

    camera.changed.addEventListener(updateBounds);

    return () => {
      camera.changed.removeEventListener(updateBounds);
    };
  }, [mainViewerRef.current]);

  // sample simulation clock
  const simTimeMs = clock.getTime();

  // derive visible aircraft
  const visibleAircraft = useMemo(() => {
    const bounds = boundsRef.current;

    if (!bounds) return [];

    return routedAircraft
      .map((aircraft) => {
        const route = processedRoutes[aircraft.routeId];

        if (!route || route.totalDistance <= 0) {
          return null;
        }

        const elapsedSeconds = aircraft.startOffsetSeconds + simTimeMs / 1000;

        const distance = aircraft.routeOffsetMeters + elapsedSeconds * aircraft.speedMps;

        const wrapped = ((distance % route.totalDistance) + route.totalDistance) % route.totalDistance;

        const { heading, position } = getPositionAlongRoute(route, wrapped);

        const carto = Cartographic.fromCartesian(position);

        const lon = CesiumMath.toDegrees(carto.longitude);

        const lat = CesiumMath.toDegrees(carto.latitude);

        const visible = lon >= bounds.west && lon <= bounds.east && lat >= bounds.south && lat <= bounds.north;

        if (!visible) return null;

        return {
          ...aircraft,
          route,
          position,
          heading,
        };
      })
      .filter((v): v is SimulatedAircraft => v !== null);
  }, [routedAircraft, processedRoutes, simTimeMs]);

  // sync visible aircraft -> redux ui list
  const previousIdsRef = useRef("");

  useEffect(() => {
    const ids = visibleAircraft.map((v) => v.id).join(",");

    if (ids === previousIdsRef.current) {
      return;
    }

    previousIdsRef.current = ids;

    dispatch(
      setAircraft(
        visibleAircraft.map((aircraft) => ({
          id: aircraft.id,
          name: aircraft.name,
          routeName: aircraft.route.name,
        })),
      ),
    );
  }, [dispatch, visibleAircraft]);

  // render entities
  const aircraftEntities = useMemo(() => {
    return visibleAircraft.map((aircraft) => {
      const isSelected = selectedAircraft?.id === aircraft.id;

      return (
        <AircraftEntity
          key={aircraft.id}
          aircraft={aircraft}
          showAircraftNames={showAircraftNames}
          isSelected={isSelected}
        />
      );
    });
  }, [visibleAircraft, showAircraftNames, selectedAircraft]);

  return {
    aircraftEntities,
    showAircraft,
  };
};

export default useAircraft;
