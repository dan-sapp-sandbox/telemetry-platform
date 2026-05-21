import { memo, useRef, useMemo, useEffect } from "react";
import {
  VerticalOrigin,
  LabelStyle,
  Color,
  HorizontalOrigin,
  Cartesian2,
  NearFarScalar,
  DistanceDisplayCondition,
  CallbackProperty,
  Cartesian3,
} from "cesium";
import { Entity } from "resium";
import { getPositionAlongRoute, type SimulatedVessel } from "./useVessels";

interface Props {
  vessel: SimulatedVessel;
  showVesselNames: boolean;
  isSelected: boolean;
}

const shipSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <!-- hull -->
  <path d="M32 2 L54 58 L32 48 L10 58 Z" fill="white"/>

  <!-- rear notch (cut-out) -->
  <path d="M26 52 L32 60 L38 52 L32 54 Z" fill="none"/>
</svg>
`;

const selectedShipSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <!-- hull -->
  <path d="M32 2 L54 58 L32 48 L10 58 Z" fill="#00d492"/>

  <!-- rear notch (cut-out) -->
  <path d="M26 52 L32 60 L38 52 L32 54 Z" fill="none"/>
</svg>
`;

const shipIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shipSvg)}`;
const selectedShipIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(selectedShipSvg)}`;

const VesselEntity = ({ vessel, showVesselNames, isSelected }: Props) => {
  const trailRef = useRef<Cartesian3[]>([]);
  const { position, heading } = useMemo(() => {
    const now = performance.now();

    const elapsedSeconds = vessel.startOffsetSeconds + now / 1000;

    const distance = vessel.routeOffsetMeters + elapsedSeconds * vessel.speedMps;

    const wrappedDistance = distance % vessel.route.totalDistance;

    return getPositionAlongRoute(vessel.route, wrappedDistance);
  }, [vessel]);

  useEffect(() => {
    trailRef.current.push(position);

    if (trailRef.current.length > 20) {
      trailRef.current.shift();
    }
  }, [position]);

  return (
    <Entity
      position={new CallbackProperty(() => position, false) as any}
      billboard={{
        image: isSelected ? selectedShipIcon : shipIcon,
        scale: isSelected ? 0.5 : 0.3,
        scaleByDistance: new NearFarScalar(400_000, 1.5, 3_000_000, 0.01),
        rotation: new CallbackProperty(() => heading, false) as any,
        verticalOrigin: VerticalOrigin.CENTER,
        pixelOffset: new Cartesian2(0, 0),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
      // polyline={{
      //   positions: new CallbackProperty(() => {
      //     return trailRef.current.slice(0, trailRef.current.length - 12);
      //   }, false),
      //   width: 3,
      //   material: Color.CYAN.withAlpha(0.15),
      // }}
      label={
        showVesselNames || isSelected
          ? {
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
            }
          : undefined
      }
      properties={{
        entityType: "vessel",
        id: vessel.id,
      }}
    />
  );
};

export default memo(VesselEntity);
