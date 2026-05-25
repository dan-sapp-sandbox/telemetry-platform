import { useState, useContext, useEffect, useMemo, type JSX } from "react";

import { useSelector } from "react-redux";

import AircraftEntity from "./AircraftEntity";

import { CameraContext } from "@/map/types";
import { type aircraftState } from "@/store/slices/aircraftSlice";
import { type PlaybackState } from "@/store/slices/playbackSlice";

import { clock } from "@/map/simulationEngine";
import { useGetAircraftQuery } from "@/store/services/api";
import { getBounds } from "@/map/utils";

export interface IAircraftState {
  aircraftEntities: JSX.Element[];
  showAircraft: boolean;
}

const useAircraft = (): IAircraftState => {
  const [, forceRender] = useState(0);

  const { showAircraft, showAircraftNames, selectedAircraft } = useSelector(
    (state: { aircraft: aircraftState }) => state.aircraft,
  );

  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const { mainViewerRef } = useContext(CameraContext);

  const bounds = getBounds(mainViewerRef.current);

  const stableBounds = useMemo(() => {
    if (!bounds) return null;

    return {
      west: bounds.west,
      south: bounds.south,
      east: bounds.east,
      north: bounds.north,
    };
  }, [bounds]);

  const { data: aircraft = [] } = useGetAircraftQuery(stableBounds!, {
    skip: !stableBounds || !mainViewerRef.current,
  });

  useEffect(() => {
    let frame: number;

    const tick = () => {
      forceRender((x) => x + 1);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      clock.play();
    } else {
      clock.pause();
    }

    clock.setSpeed(speed);
  }, [isPlaying, speed]);

  const aircraftEntities = useMemo(() => {
    return aircraft.map((a) => {
      const isSelected = selectedAircraft?.icao === a.icao;

      return <AircraftEntity key={a.icao} aircraft={a} showAircraftNames={showAircraftNames} isSelected={isSelected} />;
    });
  }, [aircraft, showAircraftNames, selectedAircraft]);

  return {
    aircraftEntities,
    showAircraft,
  };
};

export default useAircraft;
