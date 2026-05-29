import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useSelector } from "react-redux";
import type { mapState } from "@/store/slices/mapSlice";
import type { drawState } from "@/store/slices/drawSlice";
import type { vesselState } from "@/store/slices/vesselSlice";
import type { AircraftState } from "@/store/slices/aircraftSlice";

type TabId = "ai" | "details" | "playback" | "draw" | "about";

export interface ICenterPanel {
  activeTab: TabId;
  setActiveTab: Dispatch<SetStateAction<TabId>>;
}

const useCenterPanel = (): ICenterPanel => {
  const [activeTab, setActiveTab] = useState<TabId>("ai");
  const { dataLayer } = useSelector((state: { map: mapState }) => state.map);
  const { selectedEntity } = useSelector((state: { draw: drawState }) => state.draw);
  const { selectedVessel } = useSelector((state: { vessels: vesselState }) => state.vessels);
  const { selectedAircraft } = useSelector((state: { aircraft: AircraftState }) => state.aircraft);

  useEffect(() => {
    if (dataLayer === "aircraft" || dataLayer === "vessels") {
      setActiveTab("details");
    }
  }, [dataLayer]);
  useEffect(() => {
    if (selectedEntity) {
      setActiveTab("draw");
    }
  }, [selectedEntity]);
  useEffect(() => {
    if (selectedVessel) {
      setActiveTab("details");
    }
  }, [selectedVessel]);
  useEffect(() => {
    if (selectedAircraft) {
      setActiveTab("details");
    }
  }, [selectedAircraft]);

  return {
    activeTab,
    setActiveTab,
  };
};

export default useCenterPanel;
