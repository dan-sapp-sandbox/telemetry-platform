import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type vesselState, type Vessel, setSelectedVessel } from "@/store/slices/vesselSlice";
import { CameraContext } from "@/map/types";
import { Cartographic, Cartesian3 } from "cesium";

export interface IVesselDetails {
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  flyToVessel: (vessel: Vessel) => void;
  handleSetSelectedVessel: (vessel: Vessel | null) => void;
}

const useVesselDetails = (): IVesselDetails => {
  const dispatch = useDispatch();
  const { mainViewerRef } = useContext(CameraContext);
  const main = mainViewerRef.current;
  const { vessels = [], selectedVessel } = useSelector((state: { vessels: vesselState }) => state.vessels);

  const handleSetSelectedVessel = (vessel: Vessel | null) => {
    dispatch(setSelectedVessel(vessel));
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
    handleSetSelectedVessel,
    selectedVessel,
  };
};

export default useVesselDetails;
