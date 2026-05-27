import { memo, useMemo, useRef, useEffect } from "react";
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

interface Props {
  aircraft: Aircraft;
  isSelected: boolean;
}

const AircraftEntity = ({ aircraft, isSelected }: Props) => {
  const stateRef = useRef(aircraft);

  useEffect(() => {
    stateRef.current = aircraft;
  }, [aircraft]);

  const lastUpdateRef = useRef(Date.now() / 1000);

  const extrapolatedDtRef = useRef(0);

  const previousSnapshotTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now() / 1000;

    const prevSnapshot = previousSnapshotTimeRef.current;

    if (prevSnapshot != null) {
      const snapshotDelta = aircraft.snapshot_time - prevSnapshot;

      const receiveDelta = now - lastUpdateRef.current;

      extrapolatedDtRef.current += receiveDelta - snapshotDelta;

      if (extrapolatedDtRef.current < 0) {
        extrapolatedDtRef.current = 0;
      }
    }

    previousSnapshotTimeRef.current = aircraft.snapshot_time;
    lastUpdateRef.current = now;
  }, [aircraft.snapshot_time]);

  const position = useMemo(() => {
    return new CallbackProperty(() => {
      const s = stateRef.current;

      if (!s?.lon || !s?.lat) return undefined;

      const now = Date.now() / 1000;

      const liveDt = now - lastUpdateRef.current;

      const dt = liveDt + extrapolatedDtRef.current;

      const speed = s.velocity_mps ?? 0;
      const heading = CesiumMath.toRadians(s.heading_deg ?? 0);

      const distance = speed * dt;

      const metersPerDegLat = 111_320;
      const metersPerDegLon = 111_320 * Math.cos(CesiumMath.toRadians(s.lat));

      const dLat = (Math.cos(heading) * distance) / metersPerDegLat;
      const dLon = (Math.sin(heading) * distance) / metersPerDegLon;

      return Cartesian3.fromDegrees(s.lon + dLon, s.lat + dLat, s.altitude_m ?? 0);
    }, false);
  }, []);

  const orientation = useMemo(() => {
    return new CallbackProperty(() => {
      const s = stateRef.current;

      const hpr = new HeadingPitchRoll(CesiumMath.toRadians((s.heading_deg ?? 0) - 90), 0, 0);

      const pos = Cartesian3.fromDegrees(s.lon, s.lat, s.altitude_m ?? 0);

      return Transforms.headingPitchRollQuaternion(pos, hpr);
    }, false);
  }, []);

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
      viewFrom={new Cartesian3(0, -35000, 50000)}
      position={position as any}
      orientation={orientation}
      model={{
        uri: "/Airplane.glb",
        scale: 2,
        minimumPixelSize: 26,
        maximumScale: 80,
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
