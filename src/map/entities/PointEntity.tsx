import { memo, useMemo } from "react";
import {
  Cartesian2,
  Cartesian3,
  Color,
  DistanceDisplayCondition,
  HorizontalOrigin,
  LabelStyle,
  NearFarScalar,
  VerticalOrigin,
} from "cesium";
import { Entity } from "resium";
import type { DrawEntity, Position } from "@/store/slices/drawSlice";

interface Props {
  entity: DrawEntity;
}

const deserializePosition = (position: Position) => new Cartesian3(position.x, position.y, position.z);

const PointEntity = ({ entity }: Props) => {
  const position = useMemo(() => {
    return deserializePosition(entity.positions[0]);
  }, [entity.positions]);

  return (
    <Entity
      position={position}
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
};

export default memo(PointEntity);
