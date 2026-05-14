import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  type vesselState,
  type Vessel,
  setShowVessels,
  setShowVesselNames,
  setShowVesselPaths,
} from "@/store/slices/vesselSlice";
import { CameraContext } from "@/map/types";
import { Cartographic, Cartesian3 } from "cesium";

export interface IVesselPanel {
  vessels: Vessel[];
  flyToVessel: (vessel: Vessel) => void;
  showVessels: boolean;
  handleToggleShowVessels: () => void;
  showVesselNames: boolean;
  handleToggleShowVesselNames: () => void;
  showVesselPaths: boolean;
  handleToggleShowVesselPaths: () => void;
}

const useVesselPanel = (): IVesselPanel => {
  const { mainViewerRef } = useContext(CameraContext);
  const dispatch = useDispatch();
  const main = mainViewerRef.current;
  const { vessels, showVessels, showVesselNames, showVesselPaths } = useSelector(
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

  const flyToVessel = (vessel: Vessel) => {
    if (!main) return;

    const { lat, lon } = vessel;

    const currentHeight = main.camera.positionCartographic.height;

    const cartographic = Cartographic.fromDegrees(lon, lat, 0);

    const destination = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, currentHeight);

    main.camera.flyTo({
      destination,
      duration: 1.5,
    });

    return;
  };

  return {
    vessels,
    flyToVessel,
    showVessels,
    handleToggleShowVessels,
    showVesselNames,
    handleToggleShowVesselNames,
    showVesselPaths,
    handleToggleShowVesselPaths,
  };
};

export default useVesselPanel;
