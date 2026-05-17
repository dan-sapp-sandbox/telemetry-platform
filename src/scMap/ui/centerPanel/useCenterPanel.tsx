import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { useSelector } from "react-redux";
import type { actionPallet } from "@/store/slices/actionPalletSlice";

type TabId = "ai" | "details" | "about";

export interface IVesselDetails {
  activeTab: TabId;
  setActiveTab: Dispatch<SetStateAction<TabId>>;
}

const useCenterPanel = (): IVesselDetails => {
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const { activePanel } = useSelector((state: { actionPallet: actionPallet }) => state.actionPallet);

  useEffect(() => {
    if (activePanel) {
      setActiveTab("details");
    }
  }, [activePanel]);

  return {
    activeTab,
    setActiveTab,
  };
};

export default useCenterPanel;
