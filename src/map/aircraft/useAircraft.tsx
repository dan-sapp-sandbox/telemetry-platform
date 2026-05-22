import { useState, useContext, useEffect, useMemo, useRef, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cartographic, Math as CesiumMath } from "cesium";
import AircraftEntity from "./AircraftEntity";
import { CameraContext, type ProcessedRoute, type SimulatedAircraft } from "@/map/types";
import { getBounds, processRoute, getPositionAlongRoute } from "@/map/utils";
import { useGetAirRoutesQuery, useGetAircraftQuery, type IBounds } from "@/store/services/api";
import { setAircraft, type aircraftState } from "@/store/slices/aircraftSlice";

export interface IAircraftState {
  aircraftEntities: JSX.Element[];
  showAircraft: boolean;
}

const useAircraft = (): IAircraftState => {
  const [visibleAircraft, setVisibleAircraftState] = useState<SimulatedAircraft[]>([]);
  const dispatch = useDispatch();
  const simulationTimeRef = useRef(0);
  const { showAircraft, showAircraftNames, selectedAircraft } = useSelector(
    (state: { aircraft: aircraftState }) => state.aircraft,
  );

  const { mainViewerRef } = useContext(CameraContext);

  const [bounds, setBounds] = useState<IBounds | null>(null);

  const { data: routedAircraft = [] } = useGetAircraftQuery(undefined, {
    skip: !mainViewerRef.current,
  });

  const { data: routes = [] } = useGetAirRoutesQuery(undefined, {
    skip: !mainViewerRef.current,
  });

  useEffect(() => {
    let frameId: number;
    const start = performance.now();

    const tick = () => {
      simulationTimeRef.current = performance.now() - start;
      frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const processedRoutes = useMemo(() => {
    return routes.reduce<Record<string, ProcessedRoute>>((acc, route) => {
      acc[route.id] = processRoute(route);
      return acc;
    }, {});
  }, [routes]);

  useEffect(() => {
    if (!mainViewerRef.current) return;

    const updateBounds = () => {
      setBounds(getBounds(mainViewerRef.current));
    };

    updateBounds();

    mainViewerRef.current?.camera.changed.addEventListener(updateBounds);

    return () => {
      mainViewerRef.current?.camera.changed.removeEventListener(updateBounds);
    };
  }, [mainViewerRef.current]);

  useEffect(() => {
    if (!bounds) return;

    const updateVisibleAircraft = () => {
      const now = performance.now();

      const nextVisible = routedAircraft
        .map((aircraft) => {
          const route = processedRoutes[aircraft.routeId];

          if (!route || route.totalDistance <= 0) {
            return null;
          }

          const elapsedSeconds = aircraft.startOffsetSeconds + now / 1000;
          const distanceTraveled = aircraft.routeOffsetMeters + elapsedSeconds * aircraft.speedMps;
          const wrappedDistance = distanceTraveled % route.totalDistance;
          const { heading, position } = getPositionAlongRoute(route, wrappedDistance);
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

      setVisibleAircraftState(nextVisible);
    };

    updateVisibleAircraft();

    const interval = setInterval(updateVisibleAircraft, 400);

    return () => clearInterval(interval);
  }, [bounds, routedAircraft, processedRoutes]);

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
