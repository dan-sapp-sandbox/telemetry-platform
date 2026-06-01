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
import type { AISVessel } from "@/store/services/api";
import { clock } from "@/map/simulationEngine";

interface Props {
  vessel: AISVessel;
  snapshots?: AISVessel[];
  isSelected: boolean;
}

const VesselEntity = ({ vessel, snapshots, isSelected }: Props) => {
  const stateRef = useRef(vessel);

  const baseTimeRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current = vessel;
  }, [vessel]);

  const position = useMemo(() => {
    return new CallbackProperty(() => {
      const s = stateRef.current;
      if (!s?.lon || !s?.lat) return undefined;

      const timeline = snapshots;

      if (timeline && timeline.length >= 2) {
        const time = clock.getTime();

        if (!baseTimeRef.current) {
          baseTimeRef.current = timeline[0].timestamp_ms;
        }

        const toSimTime = (ms: number) => (ms - baseTimeRef.current!) / 1000;

        const first = timeline[0];
        const last = timeline[timeline.length - 1];

        const simFirst = toSimTime(first.timestamp_ms);
        const simLast = toSimTime(last.timestamp_ms);

        const span = simLast - simFirst;

        const t = span === 0 ? 0 : (time - simFirst) / span;

        const clampedT = Math.max(0, Math.min(1, t));

        // find segment
        let prev = timeline[0];
        let next = timeline[timeline.length - 1];

        for (let i = 0; i < timeline.length - 1; i++) {
          const a = toSimTime(timeline[i].timestamp_ms);
          const b = toSimTime(timeline[i + 1].timestamp_ms);

          if (a <= time && b >= time) {
            prev = timeline[i];
            next = timeline[i + 1];
            break;
          }
        }

        const lat = prev.lat + (next.lat - prev.lat) * clampedT;
        const lon = prev.lon + (next.lon - prev.lon) * clampedT;

        return Cartesian3.fromDegrees(lon, lat, 0);
      }

      const simTime = clock.getTime();

      const dt = simTime - s.timestamp_ms / 1000;

      const speedMps = (s.sog ?? 0) * 0.514444;
      const headingDeg = s.cog ?? s.heading ?? 0;
      const heading = CesiumMath.toRadians(headingDeg);

      const distance = speedMps * Math.max(0, dt);

      const metersPerDegLat = 111_320;
      const metersPerDegLon = 111_320 * Math.cos(CesiumMath.toRadians(s.lat));

      const dLat = (Math.cos(heading) * distance) / metersPerDegLat;
      const dLon = (Math.sin(heading) * distance) / metersPerDegLon;

      return Cartesian3.fromDegrees(s.lon + dLon, s.lat + dLat, 0);
    }, true);
  }, [snapshots]);

  const orientation = useMemo(() => {
    return new CallbackProperty(() => {
      const s = stateRef.current;

      const headingDeg = s.cog ?? s.heading ?? 0;

      const hpr = new HeadingPitchRoll(CesiumMath.toRadians(headingDeg - 90), 0, 0);

      const pos = Cartesian3.fromDegrees(s.lon, s.lat, 0);

      return Transforms.headingPitchRollQuaternion(pos, hpr);
    }, true);
  }, []);

  const label = useMemo(() => {
    if (!isSelected) return undefined;

    return {
      text: vessel.ship_name ?? vessel.mmsi.toString(),
      font: "12px sans-serif",
      style: LabelStyle.FILL_AND_OUTLINE,
      fillColor: Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
      verticalOrigin: VerticalOrigin.BOTTOM,
      horizontalOrigin: HorizontalOrigin.CENTER,
      pixelOffset: new Cartesian2(0, -32),
      distanceDisplayCondition: new DistanceDisplayCondition(0, 5_000_000),
    };
  }, [isSelected, vessel.ship_name, vessel.mmsi]);

  if (!vessel.lon || !vessel.lat) return null;

  return (
    <Entity
      id={vessel.mmsi.toString()}
      position={position as any}
      orientation={orientation}
      model={{
        uri: "/Container Ship.glb",
        scale: 100,
        minimumPixelSize: 16,
        maximumScale: 100_000,
        silhouetteColor: isSelected ? Color.YELLOW : undefined,
        silhouetteSize: isSelected ? 2 : undefined,
      }}
      label={label}
      viewFrom={new Cartesian3(0, -25000, 25000)}
      properties={{
        entityType: "vessel",
        mmsi: vessel.mmsi,
      }}
    />
  );
};

export default memo(VesselEntity);
