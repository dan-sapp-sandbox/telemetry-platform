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
  Cartographic,
  HeadingPitchRoll,
  Transforms,
  Math as CesiumMath,
  Matrix4,
} from "cesium";
import { Entity } from "resium";
import { createArcPoints } from "@/map/utils";
import { type SimulatedAircraft } from "@/map/types";
import { clock } from "@/map/simulationEngine";

interface Props {
  aircraft: SimulatedAircraft;
  showAircraftNames: boolean;
  isSelected: boolean;
}

const AircraftEntity = ({ aircraft, showAircraftNames, isSelected }: Props) => {
  const start = Cartographic.fromDegrees(aircraft.route.points[0].lon, aircraft.route.points[0].lat);

  const end = Cartographic.fromDegrees(aircraft.route.points[1].lon, aircraft.route.points[1].lat);

  const arcPositions = useMemo(
    () => createArcPoints(start, end, 200, 200000),
    [
      aircraft.route.points[0].lat,
      aircraft.route.points[0].lon,
      aircraft.route.points[1].lat,
      aircraft.route.points[1].lon,
    ],
  );

  const positionProperty = useMemo(
    () =>
      new CallbackProperty(() => {
        const simTimeMs = clock.getTime();

        const elapsedSeconds = aircraft.startOffsetSeconds + simTimeMs / 1000;

        const distance = aircraft.routeOffsetMeters + elapsedSeconds * aircraft.speedMps;

        const wrapped =
          ((distance % aircraft.route.totalDistance) + aircraft.route.totalDistance) % aircraft.route.totalDistance;

        const t = wrapped / aircraft.route.totalDistance;

        const scaledIndex = t * (arcPositions.length - 1);

        const index = Math.floor(scaledIndex);

        const frac = scaledIndex - index;

        const current = arcPositions[index];
        const next = arcPositions[Math.min(index + 1, arcPositions.length - 1)];

        if (!current || !next) {
          return current;
        }

        return Cartesian3.lerp(current, next, frac, new Cartesian3());
      }, false),
    [aircraft, arcPositions],
  );

  const orientationProperty = useMemo(
    () =>
      new CallbackProperty(() => {
        const simTimeMs = clock.getTime();

        const elapsedSeconds = aircraft.startOffsetSeconds + simTimeMs / 1000;

        const distance = aircraft.routeOffsetMeters + elapsedSeconds * aircraft.speedMps;

        const normalized =
          ((distance % aircraft.route.totalDistance) + aircraft.route.totalDistance) % aircraft.route.totalDistance;

        const t = normalized / aircraft.route.totalDistance;

        const scaledIndex = t * (arcPositions.length - 1);

        const index = Math.floor(scaledIndex);

        const current = arcPositions[index];

        const next = arcPositions[Math.min(index + 1, arcPositions.length - 1)];

        if (!current || !next) {
          return undefined;
        }

        const direction = Cartesian3.subtract(next, current, new Cartesian3());

        Cartesian3.normalize(direction, direction);

        const enuTransform = Transforms.eastNorthUpToFixedFrame(current);

        const inverse = Matrix4.inverseTransformation(enuTransform, new Matrix4());

        const localDirection = Matrix4.multiplyByPointAsVector(inverse, direction, new Cartesian3());

        const heading = Math.atan2(localDirection.x, localDirection.y);

        const hpr = new HeadingPitchRoll(heading + CesiumMath.toRadians(-90), 0, 0);

        return Transforms.headingPitchRollQuaternion(current, hpr);
      }, false),
    [aircraft, arcPositions],
  );

  const polyline = useMemo(
    () => ({
      positions: arcPositions,
      width: 3,
      material: Color.CYAN.withAlpha(0.15),
    }),
    [arcPositions],
  );

  return (
    <>
      <Entity
        position={positionProperty as any}
        orientation={orientationProperty as any}
        model={{
          uri: "/Airplane.glb",
          scale: 25,
          minimumPixelSize: 32,
        }}
        label={
          showAircraftNames || isSelected
            ? {
                text: aircraft.name,
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
          entityType: "aircraft",
          id: aircraft.id,
        }}
      />

      {isSelected && <Entity polyline={polyline} />}
    </>
  );
};

export default memo(AircraftEntity);
