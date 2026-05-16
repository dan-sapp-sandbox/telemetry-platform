import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { type vesselState, type Vessel } from "@/store/slices/vesselSlice";
import { CameraContext } from "@/map/types";
import { Cartographic, Cartesian3 } from "cesium";

export interface IDetailsTab {
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  flyToVessel: (vessel: Vessel) => void;
  setSelectedVessel: (vessel: Vessel) => void;
}

const useDetailsTab = (): IDetailsTab => {
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const { mainViewerRef } = useContext(CameraContext);
  const main = mainViewerRef.current;
  const { vessels = [] } = useSelector((state: { vessels: vesselState }) => state.vessels);

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
    setSelectedVessel,
    selectedVessel,
  };
};

export default useDetailsTab;
