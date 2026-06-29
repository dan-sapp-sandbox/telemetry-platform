import { type IBounds } from "@/store/services/api";
import { Math as CesiumMath, Viewer, Cartesian2, Cartographic, Cartesian3, EllipsoidGeodesic } from "cesium";
import type { ProcessedRoute, ProcessedRoutePoint, Route, RoutePositionResult } from "./types";

export const getBounds = (viewer: Viewer | null): IBounds | null => {
  if (!viewer) return null;
  const scene = viewer.scene;
  const camera = viewer.camera;
  const ellipsoid = scene.globe.ellipsoid;

  const width = scene.canvas.clientWidth;
  const height = scene.canvas.clientHeight;

  const corners = [
    new Cartesian2(0, 0),
    new Cartesian2(width, 0),
    new Cartesian2(width, height),
    new Cartesian2(0, height),
  ];

  const cartographics: Cartographic[] = [];

  for (const corner of corners) {
    const picked = camera.pickEllipsoid(corner, ellipsoid);

    if (!picked) continue;

    cartographics.push(Cartographic.fromCartesian(picked));
  }

  if (cartographics.length === 0) {
    return null;
  }

  const longitudes = cartographics.map((c) => c.longitude);
  const latitudes = cartographics.map((c) => c.latitude);

  // unwrap longitude range
  const sorted = [...longitudes].sort((a, b) => a - b);

  let maxGap = 0;
  let gapIndex = 0;

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const next = i === sorted.length - 1 ? sorted[0] + CesiumMath.TWO_PI : sorted[i + 1];

    const gap = next - current;

    if (gap > maxGap) {
      maxGap = gap;
      gapIndex = i;
    }
  }

  const west = gapIndex === sorted.length - 1 ? sorted[0] : sorted[gapIndex + 1];

  const east = sorted[gapIndex];

  return {
    west: CesiumMath.toDegrees(CesiumMath.negativePiToPi(west)),
    south: CesiumMath.toDegrees(Math.min(...latitudes)),
    east: CesiumMath.toDegrees(CesiumMath.negativePiToPi(east)),
    north: CesiumMath.toDegrees(Math.max(...latitudes)),
  };
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

export function createArcRoute(
  start: { lat: number; lon: number },
  end: { lat: number; lon: number },
  numPoints = 128,
  maxHeight = 120000, // meters
) {
  const startCartographic = Cartographic.fromDegrees(start.lon, start.lat);
  const endCartographic = Cartographic.fromDegrees(end.lon, end.lat);

  const geodesic = new EllipsoidGeodesic(startCartographic, endCartographic);

  const points: Cartesian3[] = [];

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;

    const cartographic = geodesic.interpolateUsingFraction(t);

    const height = Math.sin(Math.PI * t) * maxHeight;

    points.push(Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height));
  }

  return points;
}

export function createArcPoints(start: Cartographic, end: Cartographic, samples = 100, arcHeight = 200000) {
  const geodesic = new EllipsoidGeodesic(start, end);

  const points: Cartesian3[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;

    const cartographic = geodesic.interpolateUsingFraction(t);

    // parabolic height curve
    const height = Math.sin(Math.PI * t) * arcHeight;

    points.push(Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height));
  }

  return points;
}
