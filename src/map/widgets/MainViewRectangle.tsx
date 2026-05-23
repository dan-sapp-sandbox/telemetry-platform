import { useContext, useRef } from "react";
import { Entity } from "resium";
import { CameraContext } from "../types";
import { CallbackProperty, Color, Rectangle } from "cesium";

const MainViewRectangle = () => {
  const { mainViewerRef } = useContext(CameraContext);

  const rectangleRef = useRef<CallbackProperty | null>(null);

  if (!rectangleRef.current) {
    rectangleRef.current = new CallbackProperty(() => {
      const main = mainViewerRef.current;

      if (!main || main.isDestroyed()) {
        return Rectangle.fromDegrees(0, 0, 0, 0);
      }

      const camera = main.camera;
      const scene = main.scene;

      const rect = camera.computeViewRectangle(scene.globe.ellipsoid);

      if (!rect) {
        return Rectangle.fromDegrees(0, 0, 0, 0);
      }

      return rect.clone();
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
