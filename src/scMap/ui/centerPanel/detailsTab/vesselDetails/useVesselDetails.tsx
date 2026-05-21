import { useDispatch, useSelector } from "react-redux";
import { type vesselState, type RoutedVessel, setSelectedVessel } from "@/store/slices/vesselSlice";

export interface IVesselDetails {
  vessels: RoutedVessel[];
  selectedVessel: RoutedVessel | null;
  handleSetSelectedVessel: (vessel: RoutedVessel | null) => void;
}

const useVesselDetails = (): IVesselDetails => {
  const dispatch = useDispatch();
  const { vessels = [], selectedVessel } = useSelector((state: { vessels: vesselState }) => state.vessels);

  const handleSetSelectedVessel = (vessel: RoutedVessel | null) => {
    dispatch(setSelectedVessel(vessel));
  };

  return {
    vessels,
    handleSetSelectedVessel,
    selectedVessel,
  };
};

export default useVesselDetails;
