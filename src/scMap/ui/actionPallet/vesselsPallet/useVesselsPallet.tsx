import { useSelector, useDispatch } from "react-redux";
import { type vesselState, setShowVessels, setShowVesselNames, setShowVesselPaths } from "@/store/slices/vesselSlice";

export interface IVesselPallet {
  showVessels: boolean;
  handleToggleShowVessels: () => void;
  showVesselNames: boolean;
  handleToggleShowVesselNames: () => void;
  showVesselPaths: boolean;
  handleToggleShowVesselPaths: () => void;
}

const useVesselPallet = (): IVesselPallet => {
  const dispatch = useDispatch();
  const { showVessels, showVesselNames, showVesselPaths } = useSelector(
    (state: { vessels: vesselState }) => state.vessels,
  );

  const handleToggleShowVessels = () => {
    dispatch(setShowVessels(!showVessels));
  };
  const handleToggleShowVesselNames = () => {
    dispatch(setShowVesselNames(!showVesselNames));
  };
  const handleToggleShowVesselPaths = () => {
    dispatch(setShowVesselPaths(!showVesselPaths));
  };

  return {
    showVessels,
    handleToggleShowVessels,
    showVesselNames,
    handleToggleShowVesselNames,
    showVesselPaths,
    handleToggleShowVesselPaths,
  };
};

export default useVesselPallet;
