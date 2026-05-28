import { useDispatch, useSelector } from "react-redux";
import { type vesselState, setSelectedVessel } from "@/store/slices/vesselSlice";
import { setTrackedEntityId, type mapState } from "@/store/slices/mapSlice";
import type { AISVessel } from "@/store/services/api";

export interface IVesselDetails {
  vessels: AISVessel[];
  selectedVessel: AISVessel | null;
  handleSetSelectedVessel: (vessel: AISVessel | null) => void;
  trackSelectedVessel: () => void;
  untrackSelectedVessel: () => void;
  trackedEntityId: string | null;
}

const useVesselDetails = (): IVesselDetails => {
  const dispatch = useDispatch();
  const { trackedEntityId } = useSelector((state: { map: mapState }) => state.map);
  const { vessels = [], selectedVessel } = useSelector((state: { vessels: vesselState }) => state.vessels);

  const handleSetSelectedVessel = (vessel: AISVessel | null) => {
    dispatch(setSelectedVessel(vessel));
  };

  const trackSelectedVessel = () => {
    if (selectedVessel) {
      dispatch(setTrackedEntityId(selectedVessel.mmsi));
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
