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

interface Props {
  vessel: AISVessel;
  isSelected: boolean;
}

const VesselEntity = ({ vessel, isSelected }: Props) => {
  const stateRef = useRef(vessel);

  useEffect(() => {
    stateRef.current = vessel;
  }, [vessel]);

  const lastUpdateRef = useRef(Date.now() / 1000);

  useEffect(() => {
    lastUpdateRef.current = Date.now() / 1000;
  }, [vessel.timestamp_ms]);

  const position = useMemo(() => {
    return new CallbackProperty(() => {
      const s = stateRef.current;

      if (!s?.lon || !s?.lat) return undefined;

      const now = Date.now();

      const lastUpdateSec = s.timestamp_ms / 1000;

      const dt = now / 1000 - lastUpdateSec;

      const KNOTS_TO_MPS = 0.514444;
      const speedMps = (s.sog ?? 0) * KNOTS_TO_MPS;

      const headingDeg = s.cog ?? s.heading ?? 0;
      const heading = CesiumMath.toRadians(headingDeg);

      const distance = speedMps * dt;

      const metersPerDegLat = 111_320;
      const metersPerDegLon = 111_320 * Math.cos(CesiumMath.toRadians(s.lat));

      const dLat = (Math.cos(heading) * distance) / metersPerDegLat;
      const dLon = (Math.sin(heading) * distance) / metersPerDegLon;

      return Cartesian3.fromDegrees(s.lon + dLon, s.lat + dLat, 0);
    }, false);
  }, []);

  const orientation = useMemo(() => {
    return new CallbackProperty(() => {
      const s = stateRef.current;

      const headingDeg = s.cog ?? s.heading ?? 0;

      const hpr = new HeadingPitchRoll(CesiumMath.toRadians(headingDeg - 90), 0, 0);

      const pos = Cartesian3.fromDegrees(s.lon, s.lat, 0);

      return Transforms.headingPitchRollQuaternion(pos, hpr);
    }, false);
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
      pixelOffset: new Cartesian2(0, -24),
      distanceDisplayCondition: new DistanceDisplayCondition(0, 5_000_000),
    };
  }, [isSelected, vessel.ship_name, vessel.mmsi]);

  if (!vessel.lon || !vessel.lat) {
    return null;
  }

  return (
    <Entity
      id={vessel.mmsi.toString()}
      position={position as any}
      orientation={orientation}
      model={{
        uri: "/Container Ship.glb",
        scale: 1000,
        minimumPixelSize: 32,
        maximumScale: 100_000,
        silhouetteColor: isSelected ? Color.YELLOW : undefined,
        silhouetteSize: isSelected ? 2 : undefined,
      }}
      label={label}
      viewFrom={new Cartesian3(0, -50000, 25000)}
      properties={{
        entityType: "vessel",
        mmsi: vessel.mmsi,
      }}
    />
  );
};

export default memo(VesselEntity);
