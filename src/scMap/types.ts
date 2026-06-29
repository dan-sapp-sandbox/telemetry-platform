import { createContext, type RefObject } from "react";
import { Viewer, type Cartesian3 } from "cesium";

type CameraContextType = {
  containerRef: RefObject<HTMLDivElement | null>;
  mainViewerRef: RefObject<Viewer | null>;
  overviewViewerRef: RefObject<Viewer | null>;
  pipViewerRef: RefObject<Viewer | null>;
};

export const CameraContext = createContext<CameraContextType>({
  containerRef: { current: null },
  mainViewerRef: { current: null },
  overviewViewerRef: { current: null },
  pipViewerRef: { current: null },
});

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

export type RoutePositionResult = {
  position: Cartesian3;
  heading: number;
};

export type RoutePoint = {
  lat: number;
  lon: number;
};

export type Route = {
  id: string;
  name: string;
  points: RoutePoint[];
};

export interface SimulatedAircraft {
  id: string;
  name: string;
  routeId: string;
  route: ProcessedRoute;
  speedMps: number;
  startOffsetSeconds: number;
  routeOffsetMeters: number;
}

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
