import { useSelector, useDispatch } from "react-redux";
import MainPallet from "./MainPallet";
import LayersPallet from "./layersPallet/LayersPallet";
import DrawPallet from "./drawPallet/DrawPallet";
import VesselsPallet from "./vesselsPallet/VesselsPallet";
import AircraftPallet from "./aircraftPallet/AircraftPallet";
import { setActivePanel, type actionPallet } from "@/store/slices/actionPalletSlice";
import type { actionPanel } from "./utils";
import { useContext } from "react";
import { CameraContext } from "@/map/types";
import { defaultMainView } from "@/map/useMapState";
import { Cartesian3 } from "cesium";
import { setTrackedEntityId } from "@/store/slices/mapSlice";

const useActionPallet = () => {
  const dispatch = useDispatch();
  const { mainViewerRef } = useContext(CameraContext);
  const { activePanel } = useSelector((state: { actionPallet: actionPallet }) => state.actionPallet);

  const handleSetActivePanel = (panel: actionPanel | null) => {
    dispatch(setActivePanel(panel));
  };

  const handleResetCamera = () => {
    const viewer = mainViewerRef.current;
    if (!viewer) return;

    const camera = viewer.camera;

    dispatch(setTrackedEntityId(null));
    viewer.trackedEntity = undefined;

    camera.flyTo({
      destination: Cartesian3.fromDegrees(defaultMainView.lon, defaultMainView.lat, defaultMainView.height),
      orientation: {
        heading: defaultMainView.heading,
        pitch: defaultMainView.pitch,
        roll: defaultMainView.roll,
      },
      duration: 1.2,
    });
  };

  const getActivePanel = () => {
    switch (activePanel) {
      case "draw":
        return <DrawPallet goBack={() => handleSetActivePanel(null)} />;
      case "vessels":
        return <VesselsPallet goBack={() => handleSetActivePanel(null)} />;
      case "aircraft":
        return <AircraftPallet goBack={() => handleSetActivePanel(null)} />;
      case "layers":
        return <LayersPallet goBack={() => handleSetActivePanel(null)} />;
      default:
        return <MainPallet handleSetActivePanel={handleSetActivePanel} handleResetCamera={handleResetCamera} />;
    }
  };

  return {
    handleSetActivePanel,
    activePanel,
    getActivePanel,
    handleResetCamera,
  };
};

export default useActionPallet;
