import { memo, useMemo } from "react";
import {
  Cartesian3,
  VerticalOrigin,
  LabelStyle,
  Color,
  HorizontalOrigin,
  Cartesian2,
  NearFarScalar,
  DistanceDisplayCondition,
  Math as CesiumMath,
} from "cesium";
import { Entity } from "resium";
import type { Vessel } from "@/store/slices/vesselSlice";

interface Props {
  vessel: Vessel;
  showVesselNames: boolean;
  isSelected: boolean;
}

const shipSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <polygon points="16,0 32,32 16,24 0,32" fill="white"/>
</svg>
`;

const shipIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shipSvg)}`;

const selectedShipSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <polygon points="16,0 32,32 16,24 0,32" fill="#00d492"/>
</svg>
`;

const selectedShipIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(selectedShipSvg)}`;

const VesselEntity = ({ vessel, showVesselNames, isSelected }: Props) => {
  const position = useMemo(() => {
    const { lat, lon } = vessel;
    return Cartesian3.fromDegrees(lon, lat);
  }, [vessel.lat, vessel.lon]);

  return showVesselNames || isSelected ? (
    <Entity
      position={position}
      billboard={{
        image: isSelected ? selectedShipIcon : shipIcon,
        scale: isSelected ? 0.5 : 0.25,
        rotation: CesiumMath.toRadians(vessel.heading),
        verticalOrigin: VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
      label={{
        text: vessel.name,
        font: "5px sans-serif",
        style: LabelStyle.FILL_AND_OUTLINE,
        fillColor: Color.WHITE,
        outlineColor: Color.BLACK,
        outlineWidth: 2,
        verticalOrigin: VerticalOrigin.BOTTOM,
        horizontalOrigin: HorizontalOrigin.CENTER,
        pixelOffset: new Cartesian2(0, isSelected ? -24 : -16),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new NearFarScalar(1000, 4, 5000000, 2),
        distanceDisplayCondition: new DistanceDisplayCondition(0, 5000000),
      }}
      properties={{
        entityType: "vessel",
        id: vessel.id,
      }}
    />
  ) : (
    <Entity
      position={position}
      billboard={{
        image: shipIcon,
        scale: 0.25,
        rotation: CesiumMath.toRadians(vessel.heading),
        verticalOrigin: VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
      properties={{
        entityType: "vessel",
        id: vessel.id,
      }}
    />
  );
};

export default memo(VesselEntity);
