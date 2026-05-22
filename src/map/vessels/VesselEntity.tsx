import { memo, useMemo } from "react";
import {
  VerticalOrigin,
  LabelStyle,
  Color,
  HorizontalOrigin,
  Cartesian2,
  NearFarScalar,
  DistanceDisplayCondition,
  CallbackProperty,
} from "cesium";
import { Entity } from "resium";
import { type SimulatedVessel } from "@/map/types";
import { getPositionAlongRoute } from "@/map/utils";
import { clock } from "@/map/simulationEngine";

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
  const positionCallback = useMemo(
    () =>
      new CallbackProperty(() => {
        const t = clock.getTime();

        const elapsedSeconds = vessel.startOffsetSeconds + t / 1000;

        const distance = vessel.routeOffsetMeters + elapsedSeconds * vessel.speedMps;

        const wrapped =
          ((distance % vessel.route.totalDistance) + vessel.route.totalDistance) % vessel.route.totalDistance;

        return getPositionAlongRoute(vessel.route, wrapped).position;
      }, false),
    [vessel],
  );

  const headingCallback = useMemo(
    () =>
      new CallbackProperty(() => {
        const t = clock.getTime();

        const elapsedSeconds = vessel.startOffsetSeconds + t / 1000;

        const distance = vessel.routeOffsetMeters + elapsedSeconds * vessel.speedMps;

        const wrapped =
          ((distance % vessel.route.totalDistance) + vessel.route.totalDistance) % vessel.route.totalDistance;

        return getPositionAlongRoute(vessel.route, wrapped).heading;
      }, false),
    [vessel],
  );

  return (
    <Entity
      position={positionCallback as any}
      billboard={{
        image: isSelected ? selectedShipIcon : shipIcon,
        scale: isSelected ? 0.4 : 0.07,
        scaleByDistance: new NearFarScalar(700_000, 1.9, 9_000_000, 0.01),
        rotation: headingCallback as any,
        verticalOrigin: VerticalOrigin.CENTER,
        pixelOffset: new Cartesian2(0, 0),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }}
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
