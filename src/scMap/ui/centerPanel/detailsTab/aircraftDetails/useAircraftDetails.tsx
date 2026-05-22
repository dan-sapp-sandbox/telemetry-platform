import { useDispatch, useSelector } from "react-redux";
import { type aircraftState, type RoutedAircraft, setSelectedAircraft } from "@/store/slices/aircraftSlice";

export interface IAircraftDetails {
  aircraft: RoutedAircraft[];
  selectedAircraft: RoutedAircraft | null;
  handleSetSelectedAircraft: (aircraft: RoutedAircraft | null) => void;
}

const useAircraftDetails = (): IAircraftDetails => {
  const dispatch = useDispatch();
  const { aircraft = [], selectedAircraft } = useSelector((state: { aircraft: aircraftState }) => state.aircraft);

  const handleSetSelectedAircraft = (aircraft: RoutedAircraft | null) => {
    dispatch(setSelectedAircraft(aircraft));
  };

  return {
    aircraft,
    handleSetSelectedAircraft,
    selectedAircraft,
  };
};

export default useAircraftDetails;
