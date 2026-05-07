import { useContext, useRef } from "react";
import { Entity } from "resium";
import { CameraContext } from "./types";
import { CallbackProperty, Color, Rectangle } from "cesium";

const reusableRect = Rectangle.fromDegrees(0, 0, 0, 0);

const MainViewRectangle = () => {
  const { mainViewerRef } = useContext(CameraContext);
  const rectangleRef = useRef<CallbackProperty | null>(null);

  if (!rectangleRef.current) {
    rectangleRef.current = new CallbackProperty(() => {
      const main = mainViewerRef.current;
      if (!main || main.isDestroyed()) return reusableRect;

      const rect = main.camera.computeViewRectangle();
      if (!rect) return reusableRect;

      // Update reusable rectangle instead of creating a new one
      reusableRect.west = rect.west;
      reusableRect.south = rect.south;
      reusableRect.east = rect.east;
      reusableRect.north = rect.north;

      return reusableRect;
    }, false);
  }

  return (
    <Entity
      rectangle={{
        coordinates: rectangleRef.current,
        material: Color.RED.withAlpha(0.25),
        outline: true,
        outlineColor: Color.YELLOW,
        height: 0,
      }}
    />
  );
};

export default MainViewRectangle;
