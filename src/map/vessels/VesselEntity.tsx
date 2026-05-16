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
}

const shipSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <polygon points="16,0 32,32 16,24 0,32" fill="white"/>
</svg>
`;

const shipIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shipSvg)}`;

const VesselEntity = ({ vessel, showVesselNames }: Props) => {
  const position = useMemo(() => {
    const { lat, lon } = vessel;
    return Cartesian3.fromDegrees(lon, lat);
  }, [vessel.lat, vessel.lon]);

  return showVesselNames ? (
    <Entity
      position={position}
      billboard={{
        image: shipIcon,
        scale: 0.3,
        rotation: CesiumMath.toRadians(vessel.heading),
        verticalOrigin: VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
      label={{
        text: vessel.name,
        font: "8px sans-serif",
        style: LabelStyle.FILL_AND_OUTLINE,
        fillColor: Color.WHITE,
        outlineColor: Color.BLACK,
        outlineWidth: 2,
        verticalOrigin: VerticalOrigin.BOTTOM,
        horizontalOrigin: HorizontalOrigin.CENTER,
        pixelOffset: new Cartesian2(0, -28),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new NearFarScalar(1000, 4, 5000000, 2),
        distanceDisplayCondition: new DistanceDisplayCondition(0, 5000000),
      }}
    />
  ) : (
    <Entity
      position={position}
      billboard={{
        image: shipIcon,
        scale: 0.5,
        rotation: CesiumMath.toRadians(vessel.heading),
        verticalOrigin: VerticalOrigin.BOTTOM,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
    />
  );
};

export default memo(VesselEntity);
