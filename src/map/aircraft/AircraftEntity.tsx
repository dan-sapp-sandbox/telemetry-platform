import { memo, useMemo } from "react";
import {
  VerticalOrigin,
  LabelStyle,
  Color,
  HorizontalOrigin,
  Cartesian2,
  DistanceDisplayCondition,
  Cartesian3,
  HeadingPitchRoll,
  Transforms,
  Math as CesiumMath,
  CallbackProperty,
} from "cesium";
import { Entity } from "resium";
import { type Aircraft } from "@/store/services/api";
import { clock } from "@/map/simulationEngine";

interface Props {
  aircraft: Aircraft;
  // NOTE: later we will replace this with full snapshot array
  snapshots?: Aircraft[];
  isSelected: boolean;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function interpolatePosition(prev: Aircraft, next: Aircraft, t: number) {
  const lat = lerp(prev.lat, next.lat, t);
  const lon = lerp(prev.lon, next.lon, t);
  const alt = lerp(prev.altitude_m ?? 0, next.altitude_m ?? 0, t);

  return Cartesian3.fromDegrees(lon, lat, alt);
}

const AircraftEntity = ({ aircraft, snapshots, isSelected }: Props) => {
  const position = useMemo(() => {
    return new CallbackProperty(() => {
      const timeline = snapshots;

      // fallback mode (pre-buffer state)
      if (!timeline || timeline.length < 2) {
        return Cartesian3.fromDegrees(aircraft.lon, aircraft.lat, aircraft.altitude_m ?? 0);
      }

      const time = clock.getTime();

      // find surrounding snapshots
      let prev = timeline[0];
      let next = timeline[timeline.length - 1];

      for (let i = 0; i < timeline.length - 1; i++) {
        if (timeline[i].snapshot_time <= time && timeline[i + 1].snapshot_time >= time) {
          prev = timeline[i];
          next = timeline[i + 1];
          break;
        }
      }

      const span = next.snapshot_time - prev.snapshot_time;
      const t = span === 0 ? 0 : (time - prev.snapshot_time) / span;

      const clampedT = Math.max(0, Math.min(1, t));

      return interpolatePosition(prev, next, clampedT);
    }, false);
  }, [aircraft, snapshots]);

  const orientation = useMemo(() => {
    return new CallbackProperty(() => {
      const timeline = snapshots;

      if (!timeline || timeline.length < 2) {
        const hpr = new HeadingPitchRoll(CesiumMath.toRadians((aircraft.heading_deg ?? 0) - 90), 0, 0);

        const pos = Cartesian3.fromDegrees(aircraft.lon, aircraft.lat, aircraft.altitude_m ?? 0);

        return Transforms.headingPitchRollQuaternion(pos, hpr);
      }

      const time = clock.getTime();

      let prev = timeline[0];
      let next = timeline[timeline.length - 1];

      for (let i = 0; i < timeline.length - 1; i++) {
        if (timeline[i].snapshot_time <= time && timeline[i + 1].snapshot_time >= time) {
          prev = timeline[i];
          next = timeline[i + 1];
          break;
        }
      }

      const span = next.snapshot_time - prev.snapshot_time;
      const t = span === 0 ? 0 : (time - prev.snapshot_time) / span;

      const clampedT = Math.max(0, Math.min(1, t));

      const lon = prev.lon + (next.lon - prev.lon) * clampedT;
      const lat = prev.lat + (next.lat - prev.lat) * clampedT;
      const alt = (prev.altitude_m ?? 0) + ((next.altitude_m ?? 0) - (prev.altitude_m ?? 0)) * clampedT;

      const hpr = new HeadingPitchRoll(CesiumMath.toRadians((prev.heading_deg ?? 0) - 90), 0, 0);

      const pos = Cartesian3.fromDegrees(lon, lat, alt);

      return Transforms.headingPitchRollQuaternion(pos, hpr);
    }, false);
  }, [aircraft, snapshots]);

  const label = useMemo(() => {
    if (!isSelected) return undefined;

    return {
      text: aircraft.callsign ?? aircraft.icao,
      font: "12px sans-serif",
      style: LabelStyle.FILL_AND_OUTLINE,
      fillColor: Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
      verticalOrigin: VerticalOrigin.BOTTOM,
      horizontalOrigin: HorizontalOrigin.CENTER,
      pixelOffset: new Cartesian2(0, -24),
      distanceDisplayCondition: new DistanceDisplayCondition(0, 5_000_000),
    };
  }, [isSelected, aircraft.callsign, aircraft.icao]);

  if (!aircraft.lon || !aircraft.lat) {
    return null;
  }

  return (
    <Entity
      id={aircraft.icao}
      viewFrom={new Cartesian3(0, -25000, 25000)}
      position={position as any}
      orientation={orientation}
      model={{
        uri: "/Airplane.glb",
        scale: 1,
        minimumPixelSize: 26,
        maximumScale: 1000,
        silhouetteColor: isSelected ? Color.RED : undefined,
        silhouetteSize: isSelected ? 2 : undefined,
      }}
      label={label}
      properties={{
        entityType: "aircraft",
        icao: aircraft.icao,
      }}
    />
  );
};

export default memo(AircraftEntity);
