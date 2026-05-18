import { useSelector, useDispatch } from "react-redux";
import {
  setShowAircraft,
  setShowAircraftNames,
  setShowAircraftPaths,
  type aircraftState,
} from "@/store/slices/aircraftSlice";

export interface IAircraftPallet {
  showAircraft: boolean;
  handleToggleShowAircraft: () => void;
  showAircraftNames: boolean;
  handleToggleShowAircraftNames: () => void;
  showAircraftPaths: boolean;
  handleToggleShowAircraftPaths: () => void;
}

const useAircraftPallet = (): IAircraftPallet => {
  const dispatch = useDispatch();
  const { showAircraft, showAircraftNames, showAircraftPaths } = useSelector(
    (state: { aircraft: aircraftState }) => state.aircraft,
  );

  const handleToggleShowAircraft = () => {
    dispatch(setShowAircraft(!showAircraft));
  };
  const handleToggleShowAircraftNames = () => {
    dispatch(setShowAircraftNames(!showAircraftNames));
  };
  const handleToggleShowAircraftPaths = () => {
    dispatch(setShowAircraftPaths(!showAircraftPaths));
  };

  return {
    showAircraft,
    handleToggleShowAircraft,
    showAircraftNames,
    handleToggleShowAircraftNames,
    showAircraftPaths,
    handleToggleShowAircraftPaths,
  };
};

export default useAircraftPallet;
