import { useState, useContext, useEffect, useMemo, useRef, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Cartographic, EllipsoidGeodesic, Math as CesiumMath, Cartesian3 } from "cesium";
import VesselEntity from "./VesselEntity";
import { CameraContext } from "../types";
import { getBounds } from "./utils";
import { useGetRoutesQuery, useGetVesselsQuery, type VesselBounds } from "@/store/services/api";
import { setVessels, type Route, type vesselState } from "@/store/slices/vesselSlice";

export type ProcessedRoutePoint = {
  lat: number;
  lon: number;
  cumulativeDistance: number;
};

export type ProcessedRoute = {
  id: string;
  name: string;
  totalDistance: number;
  points: ProcessedRoutePoint[];
};

export interface SimulatedVessel {
  id: string;
  name: string;
  routeId: string;
  route: ProcessedRoute;
  speedMps: number;
  startOffsetSeconds: number;
  routeOffsetMeters: number;
  position: Cartesian3;
  heading: number;
}

type RoutePositionResult = {
  position: Cartesian3;
  heading: number;
};

export function processRoute(route: Route): ProcessedRoute {
  let cumulativeDistance = 0;

  const points: ProcessedRoutePoint[] = route.points.map((point, index) => {
    if (index > 0) {
      const prev = route.points[index - 1];

      const geodesic = new EllipsoidGeodesic(
        Cartographic.fromDegrees(prev.lon, prev.lat),
        Cartographic.fromDegrees(point.lon, point.lat),
      );

      cumulativeDistance += geodesic.surfaceDistance;
    }

    return {
      lat: point.lat,
      lon: point.lon,
      cumulativeDistance,
    };
  });

  return {
    id: route.id,
    name: route.name,
    totalDistance: cumulativeDistance,
    points,
  };
}

export function getPositionAlongRoute(route: ProcessedRoute, distanceMeters: number): RoutePositionResult {
  const { points, totalDistance } = route;

  if (!points.length) {
    return {
      position: Cartesian3.ZERO,
      heading: 0,
    };
  }

  if (distanceMeters <= 0) {
    return {
      position: Cartesian3.fromDegrees(points[0].lon, points[0].lat),
      heading: 0,
    };
  }

  if (distanceMeters >= totalDistance) {
    const last = points[points.length - 1];

    return {
      position: Cartesian3.fromDegrees(last.lon, last.lat),
      heading: 0,
    };
  }

  for (let i = 0; i < points.length - 1; i++) {
    const startPoint = points[i];
    const endPoint = points[i + 1];

    if (distanceMeters >= startPoint.cumulativeDistance && distanceMeters <= endPoint.cumulativeDistance) {
      const segmentDistance = endPoint.cumulativeDistance - startPoint.cumulativeDistance;

      const distanceIntoSegment = distanceMeters - startPoint.cumulativeDistance;

      const t = distanceIntoSegment / segmentDistance;

      const start = Cartesian3.fromDegrees(startPoint.lon, startPoint.lat);
      const end = Cartesian3.fromDegrees(endPoint.lon, endPoint.lat);

      const geodesic = new EllipsoidGeodesic(
        Cartographic.fromDegrees(startPoint.lon, startPoint.lat),
        Cartographic.fromDegrees(endPoint.lon, endPoint.lat),
      );

      geodesic.setEndPoints(
        Cartographic.fromDegrees(startPoint.lon, startPoint.lat),
        Cartographic.fromDegrees(endPoint.lon, endPoint.lat),
      );

      const cesiumHeading = Math.atan2(endPoint.lon - startPoint.lon, endPoint.lat - startPoint.lat);

      const heading = -cesiumHeading;

      return {
        position: Cartesian3.lerp(start, end, t, new Cartesian3()),
        heading,
      };
    }
  }

  const fallback = points[points.length - 1];

  return {
    position: Cartesian3.fromDegrees(fallback.lon, fallback.lat),
    heading: 0,
  };
}

export interface IVesselState {
  vesselEntities: JSX.Element[];
  showVessels: boolean;
}

const useVessels = (): IVesselState => {
  const [visibleVessels, setVisibleVesselsState] = useState<SimulatedVessel[]>([]);
  const dispatch = useDispatch();
  const simulationTimeRef = useRef(0);
  const { showVessels, showVesselNames, selectedVessel } = useSelector(
    (state: { vessels: vesselState }) => state.vessels,
  );

  const { mainViewerRef } = useContext(CameraContext);

  const [bounds, setBounds] = useState<VesselBounds | null>(null);

  const { data: routedVessels = [] } = useGetVesselsQuery(undefined, {
    skip: !mainViewerRef.current,
  });

  const { data: routes = [] } = useGetRoutesQuery(undefined, {
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

    mainViewerRef.current?.camera.moveEnd.addEventListener(updateBounds);

    return () => {
      mainViewerRef.current?.camera.moveEnd.removeEventListener(updateBounds);
    };
  }, [mainViewerRef.current]);

  const simulatedVessels: SimulatedVessel[] = useMemo(() => {
    return routedVessels
      .map((vessel) => {
        const route = processedRoutes[vessel.routeId];

        if (!route || route.totalDistance <= 0) {
          return null;
        }

        const elapsedSeconds = vessel.startOffsetSeconds + simulationTimeRef.current / 1000;
        const distanceTraveled = vessel.routeOffsetMeters + elapsedSeconds * vessel.speedMps;
        const wrappedDistance = distanceTraveled % route.totalDistance;
        const { heading, position } = getPositionAlongRoute(route, wrappedDistance);

        return {
          ...vessel,
          route,
          position,
          heading,
        };
      })
      .filter((v): v is SimulatedVessel => v !== null);
  }, [routedVessels, processedRoutes]);

  useEffect(() => {
    if (!bounds) return;

    const updateVisibleVessels = () => {
      const now = performance.now();

      const nextVisible = routedVessels
        .map((vessel) => {
          const route = processedRoutes[vessel.routeId];

          if (!route || route.totalDistance <= 0) {
            return null;
          }

          const elapsedSeconds = vessel.startOffsetSeconds + now / 1000;
          const distanceTraveled = vessel.routeOffsetMeters + elapsedSeconds * vessel.speedMps;
          const wrappedDistance = distanceTraveled % route.totalDistance;
          const { heading, position } = getPositionAlongRoute(route, wrappedDistance);
          const carto = Cartographic.fromCartesian(position);
          const lon = CesiumMath.toDegrees(carto.longitude);
          const lat = CesiumMath.toDegrees(carto.latitude);
          const visible = lon >= bounds.west && lon <= bounds.east && lat >= bounds.south && lat <= bounds.north;
          if (!visible) return null;

          return {
            ...vessel,
            route,
            position,
            heading,
          };
        })
        .filter((v): v is SimulatedVessel => v !== null);

      setVisibleVesselsState(nextVisible);
    };

    updateVisibleVessels();

    const interval = setInterval(updateVisibleVessels, 500);

    return () => clearInterval(interval);
  }, [bounds, routedVessels, processedRoutes]);

  const serializedVisibleVessels = useMemo(() => {
    return visibleVessels.map((vessel) => ({
      id: vessel.id,
      name: vessel.name,
      routeName: vessel.route.name,
    }));
  }, [visibleVessels.map((v) => v.id).join(",")]);

  useEffect(() => {
    dispatch(setVessels(serializedVisibleVessels));
  }, [dispatch, serializedVisibleVessels]);

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
