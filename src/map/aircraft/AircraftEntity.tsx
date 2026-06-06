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
import { clock } from "@/map/simulationEngine";

interface Props {
  aircraft: Aircraft;
  snapshots?: Aircraft[];
  isSelected: boolean;
}

const AircraftEntity = ({ aircraft, snapshots, isSelected }: Props) => {
  const stateRef = useRef(aircraft);

  useEffect(() => {
    stateRef.current = aircraft;
  }, [aircraft]);

  const position = useMemo(() => {
    return new CallbackProperty(() => {
      const s = stateRef.current;
      if (!s?.lon || !s?.lat) {
        return undefined;
      }

      const handleExtrapolation = () => {
        const time = clock.getTime();
        const simTime = snapshots ? time + snapshots[0].snapshot_time : time + s.snapshot_time;

        const dt = simTime - s.snapshot_time;

        const speedMps = s.velocity_mps ?? 0;
        const headingDeg = s.heading_deg ?? 0;
        const heading = CesiumMath.toRadians(headingDeg);

        const distance = speedMps * Math.max(0, dt);

        const metersPerDegLat = 111_320;
        const metersPerDegLon = 111_320 * Math.cos(CesiumMath.toRadians(s.lat));

        const dLat = (Math.cos(heading) * distance) / metersPerDegLat;
        const dLon = (Math.sin(heading) * distance) / metersPerDegLon;

        return Cartesian3.fromDegrees(s.lon + dLon, s.lat + dLat, 0);
      };

      if (snapshots && snapshots.length >= 2) {
        const time = clock.getTime();
        const simTime = time + snapshots[0].snapshot_time;

        const pastSnapshots = snapshots.filter((snapshot) => snapshot.snapshot_time < simTime);
        const futureSnapshots = snapshots.filter((snapshot) => snapshot.snapshot_time >= simTime);

        const start = pastSnapshots[pastSnapshots.length - 1];
        const end = futureSnapshots[0];
        if (!start || !end) {
          return handleExtrapolation();
        } else {
          const progessPercent = (start.snapshot_time - simTime) / (start.snapshot_time - end.snapshot_time);

          const lat = start.lat + (end.lat - start.lat) * progessPercent;
          const lon = start.lon + (end.lon - start.lon) * progessPercent;

          return Cartesian3.fromDegrees(lon, lat, 0);
        }
      }
      return handleExtrapolation();
    }, false);
  }, [snapshots]);

  const orientation = useMemo(() => {
    return new CallbackProperty(() => {
      const handleExtrapolation = () => {
        const hpr = new HeadingPitchRoll(CesiumMath.toRadians((aircraft.heading_deg ?? 0) - 90), 0, 0);

        const pos = Cartesian3.fromDegrees(aircraft.lon, aircraft.lat, aircraft.altitude_m ?? 0);

        return Transforms.headingPitchRollQuaternion(pos, hpr);
      };
      if (snapshots && snapshots.length >= 2) {
        const time = clock.getTime();
        const simTime = time + snapshots[0].snapshot_time;

        const pastSnapshots = snapshots.filter((snapshot) => snapshot.snapshot_time < simTime);
        const futureSnapshots = snapshots.filter((snapshot) => snapshot.snapshot_time >= simTime);

        const start = pastSnapshots[pastSnapshots.length - 1];
        const end = futureSnapshots[0];
        if (!start || !end) {
          return handleExtrapolation();
        } else {
          const progessPercent = (start.snapshot_time - simTime) / (start.snapshot_time - end.snapshot_time);

          const lat = start.lat + (end.lat - start.lat) * progessPercent;
          const lon = start.lon + (end.lon - start.lon) * progessPercent;
          const heading =
            (start.heading_deg || 0) + ((end.heading_deg || 0) - (start.heading_deg || 0)) * progessPercent;

          const hpr = new HeadingPitchRoll(CesiumMath.toRadians(heading - 90), 0, 0);

          const pos = Cartesian3.fromDegrees(lon, lat, 0);

          return Transforms.headingPitchRollQuaternion(pos, hpr);
        }
      }
      return handleExtrapolation();
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

  if (!aircraft.lon || !aircraft.lat) return null;

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
