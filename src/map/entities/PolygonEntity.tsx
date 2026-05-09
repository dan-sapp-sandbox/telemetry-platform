import { memo, useMemo } from "react";
import { Cartesian3, Color } from "cesium";
import { Entity } from "resium";
import type { DrawEntity, Position } from "@/store/slices/drawSlice";

interface Props {
  entity: DrawEntity;
}

const deserializePosition = (position: Position) => new Cartesian3(position.x, position.y, position.z);

const PolygonEntity = ({ entity }: Props) => {
  const positions = useMemo(() => {
    return entity.positions.map(deserializePosition);
  }, [entity.positions]);

  return (
    <Entity
      polygon={{
        hierarchy: positions,
        material: Color.ORANGE.withAlpha(0.4),
        outline: true,
        outlineColor: Color.ORANGE,
      }}
    />
  );
};

export default memo(PolygonEntity);
