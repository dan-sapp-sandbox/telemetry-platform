import { useEffect, useMemo, useRef, useState } from "react";

import {
  Cartesian2,
  Cartesian3,
  Color,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  CallbackProperty,
  LabelStyle,
  NearFarScalar,
  VerticalOrigin,
  HorizontalOrigin,
  DistanceDisplayCondition,
} from "cesium";

import { Entity, useCesium } from "resium";

import { useSelector, useDispatch } from "react-redux";
import { setDrawMode, addEntity, type drawState, type DrawEntity, type Position } from "@/store/slices/drawSlice";

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

  // ACTIVE DRAWING
  const [activePositions, setActivePositions] = useState<Cartesian3[]>([]);

  const mousePositionRef = useRef<Cartesian3 | null>(null);

  // REFS (avoid stale closures)
  const activePositionsRef = useRef<Cartesian3[]>([]);

  const drawModeRef = useRef(drawMode);

  useEffect(() => {
    drawModeRef.current = drawMode;
  }, [drawMode]);

  useEffect(() => {
    activePositionsRef.current = activePositions;
  }, [activePositions]);

  // WORLD POSITION HELPER
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

  const deserializePosition = (position: Position) => new Cartesian3(position.x, position.y, position.z);

  // SINGLE EVENT HANDLER SETUP
  useEffect(() => {
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    // LEFT CLICK
    handler.setInputAction((click: any) => {
      const mode = drawModeRef.current;

      const position = getWorldPosition(click.position);

      if (!position) return;

      // POINT
      if (mode === "point") {
        handleAddEntitity({
          id: crypto.randomUUID(),
          name: "New Point",
          type: "point",
          positions: [serializePosition(position)],
        });

        return;
      }

      // LINE / POLYGON
      setActivePositions((prev) => [...prev, position]);
    }, ScreenSpaceEventType.LEFT_CLICK);

    // MOUSE MOVE
    handler.setInputAction((movement: any) => {
      const position = getWorldPosition(movement.endPosition);

      if (!position) return;

      mousePositionRef.current = position;
    }, ScreenSpaceEventType.MOUSE_MOVE);

    // RIGHT CLICK = FINISH DRAW
    handler.setInputAction(() => {
      const mode = drawModeRef.current;

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
      if (mode === "point") {
        handleClearDrawMode();
      }
      if (mode === "polyline") {
        handleAddEntitity({
          id: crypto.randomUUID(),
          name: "New Line",
          type: mode,
          positions: positions.map(serializePosition),
        });
      }
      if (mode === "polygon") {
        handleAddEntitity({
          id: crypto.randomUUID(),
          name: "New Polygon",
          type: mode,
          positions: positions.map(serializePosition),
        });
      }

      // RESET
      setActivePositions([]);
      mousePositionRef.current = null;
    }, ScreenSpaceEventType.RIGHT_CLICK);

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

  const renderedEntities = useMemo(() => {
    return entities.map((entity) => ({
      ...entity,
      cartesianPositions: entity.positions.map(deserializePosition),
    }));
  }, [entities]);

  return (
    <>
      {renderedEntities.map((entity) => {
        if (entity.type === "point") {
          return (
            <Entity
              key={entity.id}
              position={entity.cartesianPositions[0]}
              point={{
                pixelSize: 10,
                color: Color.YELLOW,
              }}
              label={{
                text: entity.name,
                font: "14px sans-serif",
                style: LabelStyle.FILL_AND_OUTLINE,
                fillColor: Color.WHITE,
                outlineColor: Color.BLACK,
                outlineWidth: 2,
                verticalOrigin: VerticalOrigin.BOTTOM,
                horizontalOrigin: HorizontalOrigin.CENTER,
                pixelOffset: new Cartesian2(0, -12),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                scaleByDistance: new NearFarScalar(1000, 4, 5000000, 2),
                distanceDisplayCondition: new DistanceDisplayCondition(0, 5000000),
              }}
            />
          );
        }
        if (entity.type === "polyline") {
          return (
            <Entity
              key={entity.id}
              polyline={{
                positions: entity.cartesianPositions,
                width: 3,
                material: Color.CYAN,
                clampToGround: true,
              }}
            />
          );
        }
        return (
          <Entity
            key={entity.id}
            polygon={{
              hierarchy: entity.cartesianPositions,
              material: Color.ORANGE.withAlpha(0.4),
              outline: true,
              outlineColor: Color.ORANGE,
            }}
          />
        );
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
