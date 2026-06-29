import { memo, useMemo } from "react";
import { Cartesian3, Color } from "cesium";
import { Entity } from "resium";
import type { DrawEntity, Position } from "@/store/slices/drawSlice";

interface Props {
  entity: DrawEntity;
}

const deserializePosition = (position: Position) => new Cartesian3(position.x, position.y, position.z);

const PolylineEntity = ({ entity }: Props) => {
  const positions = useMemo(() => {
    return entity.positions.map(deserializePosition);
  }, [entity.positions]);

  return (
    <Entity
      polyline={{
        positions,
        width: 3,
        material: Color.CYAN,
        clampToGround: true,
      }}
      properties={{
        entityType: "draw",
        id: entity.id,
      }}
    />
  );
};

export default memo(PolylineEntity);
