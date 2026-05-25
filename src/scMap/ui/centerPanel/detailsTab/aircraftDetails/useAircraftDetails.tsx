import { useDispatch, useSelector } from "react-redux";
import { type aircraftState, setSelectedAircraft } from "@/store/slices/aircraftSlice";

import { setTrackedEntityId, type mapState } from "@/store/slices/mapSlice";

import { useGetAircraftQuery, type Aircraft } from "@/store/services/api";
import { useContext, useMemo } from "react";
import { CameraContext } from "@/map/types";
import { getBounds } from "@/map/utils";

export interface IAircraftDetails {
  aircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
  handleSetSelectedAircraft: (aircraft: Aircraft | null) => void;
  trackSelectedAircraft: () => void;
  untrackSelectedAircraft: () => void;
  trackedEntityId: string | null;
}

const useAircraftDetails = (): IAircraftDetails => {
  const dispatch = useDispatch();

  const { trackedEntityId } = useSelector((state: { map: mapState }) => state.map);

  const { selectedAircraft } = useSelector((state: { aircraft: aircraftState }) => state.aircraft);

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
    handleSetSelectedAircraft,
    selectedAircraft,
    trackedEntityId,
    trackSelectedAircraft,
    untrackSelectedAircraft,
  };
};

export default useAircraftDetails;
