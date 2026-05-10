import { useEffect, useMemo, useRef, useState } from "react";

import { Cartesian2, Cartesian3, Color, ScreenSpaceEventHandler, ScreenSpaceEventType, CallbackProperty } from "cesium";
import PolygonEntity from "./entities/PolygonEntity";
import PolylineEntity from "./entities/PolylineEntity";
import PointEntity from "./entities/PointEntity";

import { Entity, useCesium } from "resium";

import { useSelector, useDispatch } from "react-redux";
import { setDrawMode, addEntity, type drawState, type DrawEntity } from "@/store/slices/drawSlice";

const DrawController = () => {
  const dispatch = useDispatch();
  const { viewer } = useCesium();

  const { drawMode, entities } = useSelector((state: { draw: drawState }) => state.draw);

  const handleAddEntitity = (newEntity: DrawEntity) => {
    dispatch(addEntity(newEntity));
  };
  const handleClearDrawMode = () => {
    dispatch(setDrawMode(null));
  };

  const [activePositions, setActivePositions] = useState<Cartesian3[]>([]);

  const mousePositionRef = useRef<Cartesian3 | null>(null);

  const activePositionsRef = useRef<Cartesian3[]>([]);

  const drawModeRef = useRef(drawMode);

  useEffect(() => {
    drawModeRef.current = drawMode;
  }, [drawMode]);

  useEffect(() => {
    activePositionsRef.current = activePositions;
  }, [activePositions]);

  const getWorldPosition = (screenPosition: Cartesian2) => {
    if (!viewer) return null;

    const ray = viewer.camera.getPickRay(screenPosition);

    if (!ray) return null;

    return viewer.scene.globe.pick(ray, viewer.scene);
  };

  const serializePosition = (position: Cartesian3) => ({
    x: position.x,
    y: position.y,
    z: position.z,
  });

  useEffect(() => {
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    // LEFT CLICK
    handler.setInputAction((click: any) => {
      const mode = drawModeRef.current;
      if (!mode) return;

      const position = getWorldPosition(click.position);

      if (!position) return;

      if (mode === "point") {
        handleAddEntitity({
          id: crypto.randomUUID(),
          type: "point",
          positions: [serializePosition(position)],
        });

        return;
      }

      if (mode === "polyline" || mode === "polygon") {
        setActivePositions((prev) => [...prev, position]);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    // MOUSE MOVE
    handler.setInputAction((movement: any) => {
      const position = getWorldPosition(movement.endPosition);

      if (!position) return;

      mousePositionRef.current = position;
    }, ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction(() => {
      const mode = drawModeRef.current;
      if (!mode) return;

      const positions = activePositionsRef.current;

      // VALIDATION
      if (mode === "polyline" && positions.length < 2) {
        setActivePositions([]);
        return;
      }

      if (mode === "polygon" && positions.length < 3) {
        setActivePositions([]);
        return;
      }

      // SAVE ENTITY
      if (mode === "polyline") {
        handleAddEntitity({
          id: crypto.randomUUID(),
          type: mode,
          positions: positions.map(serializePosition),
        });
      }
      if (mode === "polygon") {
        handleAddEntitity({
          id: crypto.randomUUID(),
          type: mode,
          positions: positions.map(serializePosition),
        });
      }

      // RESET
      handleClearDrawMode();
      requestAnimationFrame(() => {
        setActivePositions([]);
        mousePositionRef.current = null;
      });
    }, ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    return () => {
      handler.destroy();
    };
  }, [viewer]);

  // LIVE PREVIEW POSITIONS
  const livePositions = useMemo(() => {
    return new CallbackProperty(() => {
      if (mousePositionRef.current && activePositionsRef.current.length > 0) {
        return [...activePositionsRef.current, mousePositionRef.current];
      }

      return activePositionsRef.current;
    }, false);
  }, []);

  return (
    <>
      {entities.map((entity) => {
        if (entity.type === "point") {
          return <PointEntity key={entity.id} entity={entity} />;
        }

        if (entity.type === "polyline") {
          return <PolylineEntity key={entity.id} entity={entity} />;
        }

        return <PolygonEntity key={entity.id} entity={entity} />;
      })}
      {activePositions.map((position, index) => (
        <Entity
          key={`active-${index}`}
          position={position}
          point={{
            pixelSize: 8,
            color: Color.WHITE,
          }}
        />
      ))}
      {(drawMode === "polyline" || drawMode === "polygon") && activePositions.length >= 1 && (
        <Entity
          key="active-live-polyline"
          polyline={{
            positions: livePositions,
            width: 2,
            material: Color.WHITE,
            clampToGround: true,
          }}
        />
      )}
      {drawMode === "polygon" && activePositions.length >= 2 && (
        <Entity
          key="active-live-polygon"
          polygon={{
            hierarchy: new CallbackProperty(() => {
              if (mousePositionRef.current && activePositionsRef.current.length >= 2) {
                return {
                  positions: [...activePositionsRef.current, mousePositionRef.current],
                };
              }

              return {
                positions: activePositionsRef.current,
              };
            }, false),
            material: Color.WHITE.withAlpha(0.2),
            outline: true,
            outlineColor: Color.WHITE,
          }}
        />
      )}
    </>
  );
};

export default DrawController;
