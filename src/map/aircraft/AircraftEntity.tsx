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
} from "cesium";
import { Entity } from "resium";
import { type Aircraft } from "@/store/services/api";

interface Props {
  aircraft: Aircraft;
  showAircraftNames: boolean;
  isSelected: boolean;
}

const AircraftEntity = ({ aircraft, showAircraftNames, isSelected }: Props) => {
  const position = useMemo(() => {
    if (!aircraft.lon || !aircraft.lat) return undefined;

    return Cartesian3.fromDegrees(aircraft.lon, aircraft.lat, aircraft.altitude_m ?? 0);
  }, [aircraft.lon, aircraft.lat, aircraft.altitude_m]);

  const orientation = useMemo(() => {
    if (!position) return undefined;

    // fallback if missing heading
    const headingDeg = aircraft.heading_deg ?? 0;

    const hpr = new HeadingPitchRoll(CesiumMath.toRadians(headingDeg - 90), 0, 0);

    return Transforms.headingPitchRollQuaternion(position, hpr);
  }, [position, aircraft.heading_deg]);

  const label =
    showAircraftNames || isSelected
      ? {
          text: aircraft.callsign ?? aircraft.icao,
          font: "12px sans-serif",
          style: LabelStyle.FILL_AND_OUTLINE,
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          verticalOrigin: VerticalOrigin.BOTTOM,
          horizontalOrigin: HorizontalOrigin.CENTER,
          pixelOffset: new Cartesian2(0, isSelected ? -24 : -16),
          distanceDisplayCondition: new DistanceDisplayCondition(0, 5_000_000),
        }
      : undefined;

  return (
    <Entity
      id={aircraft.icao}
      viewFrom={new Cartesian3(20000, 35000, 30000)}
      position={position}
      orientation={orientation}
      model={{
        uri: "/Airplane.glb",
        scale: 5,
        minimumPixelSize: 7,
        maximumScale: 1000,
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
