import { useEffect, useState } from "react";

import { Cartesian3, Color, ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";

import { Entity, PolylineGraphics, useCesium } from "resium";

import { useSelector } from "react-redux";
import { type drawState } from "@/store/slices/drawSlice";

const DrawController = () => {
  const { drawMode } = useSelector((state: { draw: drawState }) => state.draw);
  const { viewer } = useCesium();

  const [positions, setPositions] = useState<Cartesian3[]>([]);

  useEffect(() => {
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click: any) => {
      const ray = viewer.camera.getPickRay(click.position);

      if (!ray) return;

      const position = viewer.scene.pickPosition(click.position) || viewer.scene.globe.pick(ray, viewer.scene);

      if (!position) return;

      setPositions((prev) => [...prev, position]);
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [viewer]);

  return (
    <>
      {/* POINTS */}
      {positions.map((position, index) => (
        <Entity
          key={index}
          position={position}
          point={{
            pixelSize: 10,
            color: Color.YELLOW,
          }}
        />
      ))}

      {/* POLYLINE */}
      {positions.length >= 2 && (
        <Entity>
          <PolylineGraphics positions={positions} width={4} material={Color.CYAN} clampToGround />
        </Entity>
      )}
    </>
  );
};

export default DrawController;
