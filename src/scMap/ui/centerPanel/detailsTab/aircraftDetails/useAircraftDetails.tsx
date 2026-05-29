import { useDispatch, useSelector } from "react-redux";
import { useContext, useMemo } from "react";

import { type AircraftState, setSelectedAircraft } from "@/store/slices/aircraftSlice";
import { setTrackedEntityId, type mapState } from "@/store/slices/mapSlice";

import type { Aircraft } from "@/store/services/api";
import { clock } from "@/map/simulationEngine";
import { getBounds } from "@/map/utils";
import { CameraContext } from "@/map/types";

/**
 * Resolve snapshot at a given simulation time
 */
function getSnapshotAtTime(timeline: Aircraft[], time: number): Aircraft | null {
  if (!timeline.length) return null;

  if (time <= timeline[0].snapshot_time) return timeline[0];

  if (time >= timeline[timeline.length - 1].snapshot_time) {
    return timeline[timeline.length - 1];
  }

  for (let i = 0; i < timeline.length - 1; i++) {
    const a = timeline[i];
    const b = timeline[i + 1];

    if (a.snapshot_time <= time && time <= b.snapshot_time) {
      return a;
    }
  }

  return timeline[timeline.length - 1];
}

/**
 * Simple bbox filter
 * (you already have this concept elsewhere)
 */
function isInBounds(a: Aircraft, bounds: any): boolean {
  if (!bounds) return true;

  return a.lon >= bounds.west && a.lon <= bounds.east && a.lat >= bounds.south && a.lat <= bounds.north;
}

export interface IAircraftDetails {
  aircraft: Aircraft[];
  visibleAircraft: Aircraft[];
  selectedAircraft: Aircraft | null;

  handleSetSelectedAircraft: (aircraft: Aircraft | null) => void;
  trackSelectedAircraft: () => void;
  untrackSelectedAircraft: () => void;

  trackedEntityId: string | null;
}

const useAircraftDetails = (): IAircraftDetails => {
  const dispatch = useDispatch();

  const { mainViewerRef } = useContext(CameraContext);

  const { trackedEntityId } = useSelector((state: { map: mapState }) => state.map);

  const { aircraftMap, selectedAircraft } = useSelector((state: { aircraft: AircraftState }) => state.aircraft);

  const time = clock.getTime();

  const aircraft = useMemo(() => {
    const map = aircraftMap ?? {};

    return Object.values(map)
      .map((timeline) => getSnapshotAtTime(timeline, time))
      .filter((a): a is Aircraft => a !== null);
  }, [aircraftMap, time]);

  const bounds = getBounds(mainViewerRef.current);

  const visibleAircraft = useMemo(() => {
    return aircraft.filter((a) => isInBounds(a, bounds));
  }, [aircraft, bounds]);

  const handleSetSelectedAircraft = (aircraft: Aircraft | null) => {
    dispatch(setSelectedAircraft(aircraft));
  };

  const trackSelectedAircraft = () => {
    if (selectedAircraft) {
      dispatch(setTrackedEntityId(selectedAircraft.icao));
    }
  };

  const untrackSelectedAircraft = () => {
    dispatch(setTrackedEntityId(null));
  };

  return {
    aircraft,
    visibleAircraft,
    selectedAircraft,
    handleSetSelectedAircraft,
    trackedEntityId,
    trackSelectedAircraft,
    untrackSelectedAircraft,
  };
};

export default useAircraftDetails;
