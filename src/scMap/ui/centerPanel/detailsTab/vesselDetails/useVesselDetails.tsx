import { useDispatch, useSelector } from "react-redux";
import { type vesselState, type RoutedVessel, setSelectedVessel } from "@/store/slices/vesselSlice";
import { setTrackedEntityId, type mapState } from "@/store/slices/mapSlice";

export interface IVesselDetails {
  vessels: RoutedVessel[];
  selectedVessel: RoutedVessel | null;
  handleSetSelectedVessel: (vessel: RoutedVessel | null) => void;
  trackSelectedVessel: () => void;
  untrackSelectedVessel: () => void;
  trackedEntityId: string | null;
}

const useVesselDetails = (): IVesselDetails => {
  const dispatch = useDispatch();
  const { trackedEntityId } = useSelector((state: { map: mapState }) => state.map);
  const { vessels = [], selectedVessel } = useSelector((state: { vessels: vesselState }) => state.vessels);

  const handleSetSelectedVessel = (vessel: RoutedVessel | null) => {
    dispatch(setSelectedVessel(vessel));
  };

  const trackSelectedVessel = () => {
    if (selectedVessel) {
      dispatch(setTrackedEntityId(selectedVessel.id));
    }
  };

  const untrackSelectedVessel = () => {
    dispatch(setTrackedEntityId(null));
  };

  return {
    vessels,
    handleSetSelectedVessel,
    trackSelectedVessel,
    untrackSelectedVessel,
    selectedVessel,
    trackedEntityId,
  };
};

export default useVesselDetails;
