import { useState } from "react";
import MainPallet from "./MainPallet";
import LayersPallet from "./LayersPallet";
import DrawPallet from "./DrawPallet";
import VesselsPallet from "./vesselsPallet/VesselsPallet";
import AircraftPallet from "./AircraftPallet";
import type { actionPanel } from "./utils";

const useActionPallet = () => {
  const [activePanel, setActivePanel] = useState<actionPanel | null>(null);

  const getActivePanel = () => {
    switch (activePanel) {
      case "draw":
        return <DrawPallet goBack={() => setActivePanel(null)} />;
      case "vessels":
        return <VesselsPallet goBack={() => setActivePanel(null)} />;
      case "aircraft":
        return <AircraftPallet goBack={() => setActivePanel(null)} />;
      case "layers":
        return <LayersPallet goBack={() => setActivePanel(null)} />;
      default:
        return <MainPallet setActivePanel={setActivePanel} />;
    }
  };

  return {
    setActivePanel,
    activePanel,
    getActivePanel,
  };
};

export default useActionPallet;
