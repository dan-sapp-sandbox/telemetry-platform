import { useDispatch, useSelector } from "react-redux";
import { type aircraftState, type RoutedAircraft, setSelectedAircraft } from "@/store/slices/aircraftSlice";
import { setTrackedEntityId, type mapState } from "@/store/slices/mapSlice";

export interface IAircraftDetails {
  aircraft: RoutedAircraft[];
  selectedAircraft: RoutedAircraft | null;
  handleSetSelectedAircraft: (aircraft: RoutedAircraft | null) => void;
  trackSelectedAircraft: () => void;
  untrackSelectedAircraft: () => void;
  trackedEntityId: string | null;
}

const useAircraftDetails = (): IAircraftDetails => {
  const dispatch = useDispatch();
  const { trackedEntityId } = useSelector((state: { map: mapState }) => state.map);
  const { aircraft = [], selectedAircraft } = useSelector((state: { aircraft: aircraftState }) => state.aircraft);

  const handleSetSelectedAircraft = (aircraft: RoutedAircraft | null) => {
    dispatch(setSelectedAircraft(aircraft));
  };

  const trackSelectedAircraft = () => {
    if (selectedAircraft) {
      dispatch(setTrackedEntityId(selectedAircraft.id));
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
