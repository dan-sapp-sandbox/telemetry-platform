import { useSelector, useDispatch } from "react-redux";
import MainPallet from "./MainPallet";
import LayersPallet from "./LayersPallet";
import DrawPallet from "./DrawPallet";
import VesselsPallet from "./vesselsPallet/VesselsPallet";
import AircraftPallet from "./AircraftPallet";
import { setActivePanel, type actionPallet } from "@/store/slices/actionPalletSlice";
import type { actionPanel } from "./utils";

const useActionPallet = () => {
  const dispatch = useDispatch();
  const { activePanel } = useSelector((state: { actionPallet: actionPallet }) => state.actionPallet);

  const handleSetActivePanel = (panel: actionPanel | null) => {
    dispatch(setActivePanel(panel));
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
        return <MainPallet handleSetActivePanel={handleSetActivePanel} />;
    }
  };

  return {
    handleSetActivePanel,
    activePanel,
    getActivePanel,
  };
};

export default useActionPallet;
