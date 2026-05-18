import { useContext, useRef } from "react";
import { Entity } from "resium";
import { CameraContext } from "../types";
import { CallbackProperty, Color, Rectangle, Cartesian2, Cartographic, Math as CesiumMath } from "cesium";

const reusableRect = Rectangle.fromDegrees(0, 0, 0, 0);

const normalizeLongitudeRange = (longitudes: number[]) => {
  if (longitudes.length === 0) {
    return { west: 0, east: 0 };
  }

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
    west: CesiumMath.negativePiToPi(west),
    east: CesiumMath.negativePiToPi(east),
  };
};

const MainViewRectangle = () => {
  const { mainViewerRef } = useContext(CameraContext);
  const rectangleRef = useRef<CallbackProperty | null>(null);

  if (!rectangleRef.current) {
    rectangleRef.current = new CallbackProperty(() => {
      const main = mainViewerRef.current;

      if (!main || main.isDestroyed()) {
        return reusableRect;
      }

      const scene = main.scene;
      const camera = main.camera;
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
        return reusableRect;
      }

      const longitudes = cartographics.map((c) => c.longitude);
      const latitudes = cartographics.map((c) => c.latitude);

      const { west, east } = normalizeLongitudeRange(longitudes);

      reusableRect.west = west;
      reusableRect.east = east;
      reusableRect.south = Math.min(...latitudes);
      reusableRect.north = Math.max(...latitudes);

      return reusableRect;
    }, false);
  }

  return (
    <Entity
      rectangle={{
        coordinates: rectangleRef.current,
        material: Color.GREEN.withAlpha(0.2),
        outline: true,
        outlineColor: Color.GREENYELLOW.withAlpha(0.8),
        height: 0,
      }}
    />
  );
};

export default MainViewRectangle;
