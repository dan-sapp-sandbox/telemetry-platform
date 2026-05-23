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
  Cartesian3,
  HeadingPitchRoll,
  Transforms,
  Matrix4,
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

  const orientationCallback = useMemo(
    () =>
      new CallbackProperty(() => {
        const t = clock.getTime();

        const elapsedSeconds = vessel.startOffsetSeconds + t / 1000;

        const distance = vessel.routeOffsetMeters + elapsedSeconds * vessel.speedMps;

        const wrapped =
          ((distance % vessel.route.totalDistance) + vessel.route.totalDistance) % vessel.route.totalDistance;

        const current = getPositionAlongRoute(vessel.route, wrapped);
        const next = getPositionAlongRoute(vessel.route, wrapped + 100);

        if (!current?.position || !next?.position) return undefined;

        const position = current.position;

        const velocity = Cartesian3.subtract(next.position, current.position, new Cartesian3());

        if (Cartesian3.magnitudeSquared(velocity) === 0) return undefined;

        const enuToFixed = Transforms.eastNorthUpToFixedFrame(position);
        const fixedToEnu = Matrix4.inverse(enuToFixed, new Matrix4());

        const localVelocity = Matrix4.multiplyByPointAsVector(fixedToEnu, velocity, new Cartesian3());

        Cartesian3.normalize(localVelocity, localVelocity);

        const heading = Math.atan2(localVelocity.x, localVelocity.y) - Math.PI / 2;

        const hpr = new HeadingPitchRoll(heading, 0, 0);

        return Transforms.headingPitchRollQuaternion(position, hpr);
      }, false),
    [vessel],
  );

  return (
    <Entity
      model={{
        uri: "/Container Ship.glb",
        scale: 20000,
        minimumPixelSize: 16,
        maximumScale: 2000000,
      }}
      position={positionCallback as any}
      orientation={orientationCallback as any}
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
