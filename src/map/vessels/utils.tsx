import { type VesselBounds } from "@/store/services/api";
import { Math as CesiumMath, Viewer, Cartesian2, Cartographic } from "cesium";

export const getBounds = (viewer: Viewer | null): VesselBounds | null => {
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
