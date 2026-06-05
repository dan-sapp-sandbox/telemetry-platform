import { useDispatch, useSelector } from "react-redux";
import { useContext, useMemo } from "react";

import { type AircraftState, setSelectedAircraft } from "@/store/slices/aircraftSlice";
import { setTrackedEntityId, type mapState } from "@/store/slices/mapSlice";

import type { Aircraft } from "@/store/services/api";
import { getBounds } from "@/map/utils";
import { CameraContext } from "@/map/types";

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

  const { aircraft, selectedAircraft } = useSelector((state: { aircraft: AircraftState }) => state.aircraft);

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
