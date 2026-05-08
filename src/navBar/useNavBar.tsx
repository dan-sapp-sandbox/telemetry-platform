import { useState, type JSX, type Dispatch, type SetStateAction } from "react";
import IntroPanel from "@/panels/IntroPanel";
import SettingsPanel from "@/panels/settings/SettingsPanel";
import GuidePanel from "@/panels/guides/GuidePanel";
import DrawPanel from "@/panels/drawing/DrawPanel";
import ReportBuilderPanel from "@/panels/ReportBuilderPanel";
import VesselPanel from "@/panels/VesselPanel";
import AircraftPanel from "@/panels/AircraftPanel";
import { cn } from "@/lib/utils";

type panelType = "intro" | "settings" | "guide" | "draw" | "report-builder" | "vessels" | "aircraft";

interface INavBarState {
  showPanel: boolean;
  setShowPanel: Dispatch<SetStateAction<boolean>>;
  panel: panelType;
  handleTogglePanel: (newPanelType: panelType) => void;
  buttonStyles: string;
  iconStyles: string;
  panelStyles: string;
  getActivePanel: () => JSX.Element | null;
}

const useNavBar = (): INavBarState => {
  const [showPanel, setShowPanel] = useState<boolean>(true);
  const [panel, setPanel] = useState<panelType>("intro");

  const handleTogglePanel = (newPanelType: panelType) => {
    if (newPanelType === panel) {
      if (!showPanel) {
        setShowPanel(true);
      } else {
        setShowPanel(false);
      }
    } else {
      setPanel(newPanelType);
      if (!showPanel) {
        setShowPanel(true);
      }
    }
  };

  const buttonStyles = cn([
    "flex flex-row items-center gap-1 p-1 md:p-3 cursor-pointer",
    "text-(--link) hover:text-(--link-hover) bg-white/10 hover:bg-white/15",
  ]);
  const iconStyles = cn(["size-8 md:size-10"]);
  const panelStyles = cn(
    "absolute top-0 left-12 md:left-18 h-full md:w-120",
    "w-[calc(100%-3rem)]",
    "z-1000 bg-(--background)/80 border-l border-white/10",
    "transform-gpu transition-transform duration-500 ease-out",
    showPanel ? "translate-x-0" : "-translate-x-full",
  );

  const getActivePanel = () => {
    switch (panel) {
      case "intro":
        return <IntroPanel openGuide={() => setPanel("guide")} />;
      case "settings":
        return <SettingsPanel />;
      case "guide":
        return <GuidePanel />;
      case "draw":
        return <DrawPanel />;
      case "report-builder":
        return <ReportBuilderPanel />;
      case "vessels":
        return <VesselPanel />;
      case "aircraft":
        return <AircraftPanel />;
      default:
        return null;
    }
  };
  return {
    showPanel,
    setShowPanel,
    panel,
    handleTogglePanel,
    buttonStyles,
    iconStyles,
    panelStyles,
    getActivePanel,
  };
};

export default useNavBar;
