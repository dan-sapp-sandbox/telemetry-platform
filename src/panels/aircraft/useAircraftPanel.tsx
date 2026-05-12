import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type aircraftState, type Aircraft, setShowAircraft, setShowAircraftPaths } from "@/store/slices/aircraftSlice";
import { CameraContext } from "@/map/types";
import { Cartographic, Cartesian3 } from "cesium";

export interface IAircraftPanel {
  aircraft: Aircraft[];
  flyToAircraft: (aircraft: Aircraft) => void;
  showAircraft: boolean;
  handleToggleShowAircraft: () => void;
  showAircraftPaths: boolean;
  handleToggleShowAircraftPaths: () => void;
}

const useAircraftPanel = (): IAircraftPanel => {
  const dispatch = useDispatch();
  const { aircraft, showAircraft, showAircraftPaths } = useSelector(
    (state: { aircraft: aircraftState }) => state.aircraft,
  );

  const handleToggleShowAircraft = () => {
    dispatch(setShowAircraft(!showAircraft));
  };
  const handleToggleShowAircraftPaths = () => {
    dispatch(setShowAircraftPaths(!showAircraftPaths));
  };

  const { mainViewerRef } = useContext(CameraContext);
  const main = mainViewerRef.current;

  const flyToAircraft = (aircraft: Aircraft) => {
    if (!main) return;

    const { lat, lon } = aircraft;

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
    aircraft,
    flyToAircraft,
    showAircraft,
    handleToggleShowAircraft,
    showAircraftPaths,
    handleToggleShowAircraftPaths,
  };
};

export default useAircraftPanel;
