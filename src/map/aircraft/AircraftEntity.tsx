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
} from "cesium";
import { Entity } from "resium";
import { createArcRoute, getPositionAlongRoute } from "@/map/utils";
import { type SimulatedAircraft } from "@/map/types";
import { clock } from "@/map/simulationEngine";

interface Props {
  aircraft: SimulatedAircraft;
  showAircraftNames: boolean;
  isSelected: boolean;
}

const shipSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <path d="M32 2 L54 58 L32 48 L10 58 Z" fill="white"/>
  <path d="M26 52 L32 60 L38 52 L32 54 Z" fill="none"/>
</svg>
`;

const selectedShipSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <path d="M32 2 L54 58 L32 48 L10 58 Z" fill="#00d492"/>
  <path d="M26 52 L32 60 L38 52 L32 54 Z" fill="none"/>
</svg>
`;

const shipIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(shipSvg)}`;
const selectedShipIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(selectedShipSvg)}`;

const AircraftEntity = ({ aircraft, showAircraftNames, isSelected }: Props) => {
  const start = aircraft.route.points[0];
  const end = aircraft.route.points[1];

  const arcPositions = useMemo(() => createArcRoute(start, end), [start.lat, start.lon, end.lat, end.lon]);

  const positionProperty = useMemo(
    () =>
      new CallbackProperty(() => {
        const t = clock.getTime();

        const elapsedSeconds = aircraft.startOffsetSeconds + t / 1000;

        const distance = aircraft.routeOffsetMeters + elapsedSeconds * aircraft.speedMps;

        const wrapped =
          ((distance % aircraft.route.totalDistance) + aircraft.route.totalDistance) % aircraft.route.totalDistance;

        return getPositionAlongRoute(aircraft.route, wrapped).position;
      }, false),
    [aircraft],
  );

  // const positionProperty = useMemo(
  //   () =>
  //     new CallbackProperty(() => {
  //       const simTimeMs = clock.getTime();

  //       const elapsedSeconds = aircraft.startOffsetSeconds + simTimeMs / 1000;

  //       const distance = aircraft.routeOffsetMeters + elapsedSeconds * aircraft.speedMps;

  //       const normalized =
  //         ((distance % aircraft.route.totalDistance) + aircraft.route.totalDistance) % aircraft.route.totalDistance;

  //       const t = normalized / aircraft.route.totalDistance;

  //       const index = Math.floor(t * (arcPositions.length - 1));

  //       return arcPositions[index];
  //     }, false),
  //   [aircraft, arcPositions],
  // );

  const rotationProperty = useMemo(
    () =>
      new CallbackProperty(() => {
        const simTimeMs = clock.getTime();

        const elapsedSeconds = aircraft.startOffsetSeconds + simTimeMs / 1000;

        const distance = aircraft.routeOffsetMeters + elapsedSeconds * aircraft.speedMps;

        const normalized =
          ((distance % aircraft.route.totalDistance) + aircraft.route.totalDistance) % aircraft.route.totalDistance;

        const t = normalized / aircraft.route.totalDistance;

        const index = Math.floor(t * (arcPositions.length - 1));

        const position = arcPositions[index];

        const nextPosition = arcPositions[Math.min(index + 50, arcPositions.length - 1)];

        if (!position || !nextPosition) {
          return 0;
        }

        const direction = Cartesian3.subtract(nextPosition, position, new Cartesian3());

        return Math.atan2(direction.x, direction.y) - Math.PI / 2;
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
        billboard={{
          image: isSelected ? selectedShipIcon : shipIcon,
          scale: isSelected ? 1 : 0.5,
          scaleByDistance: new NearFarScalar(700_000, 1.9, 9_000_000, 0.01),
          rotation: rotationProperty as any,
          verticalOrigin: VerticalOrigin.CENTER,
          pixelOffset: new Cartesian2(0, 0),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
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
