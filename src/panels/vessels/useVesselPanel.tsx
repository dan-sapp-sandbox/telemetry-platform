import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type vesselState, type Vessel, setShowVessels, setShowVesselPaths } from "@/store/slices/vesselSlice";
import { CameraContext } from "@/map/types";
import { Cartographic, Cartesian3 } from "cesium";

export interface IVesselPanel {
  vessels: Vessel[];
  flyToVessel: (vessel: Vessel) => void;
  showVessels: boolean;
  handleToggleShowVessels: () => void;
  showVesselPaths: boolean;
  handleToggleShowVesselPaths: () => void;
}

const useVesselPanel = (): IVesselPanel => {
  const dispatch = useDispatch();
  const { vessels, showVessels, showVesselPaths } = useSelector((state: { vessels: vesselState }) => state.vessels);

  const handleToggleShowVessels = () => {
    dispatch(setShowVessels(!showVessels));
  };
  const handleToggleShowVesselPaths = () => {
    dispatch(setShowVesselPaths(!showVesselPaths));
  };

  const { mainViewerRef } = useContext(CameraContext);
  const main = mainViewerRef.current;

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
    showVesselPaths,
    handleToggleShowVesselPaths,
  };
};

export default useVesselPanel;
