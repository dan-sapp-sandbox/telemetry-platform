import { useDispatch, useSelector } from "react-redux";
import { type aircraftState, setSelectedAircraft } from "@/store/slices/aircraftSlice";
import { setTrackedEntityId, type mapState } from "@/store/slices/mapSlice";
import { type Aircraft } from "@/store/services/api";

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

  const { aircraft, selectedAircraft } = useSelector((state: { aircraft: aircraftState }) => state.aircraft);

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
