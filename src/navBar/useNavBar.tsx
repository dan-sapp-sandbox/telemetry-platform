import { useState } from "react";
import IntroPanel from "@/panels/IntroPanel";
import SettingsPanel from "@/panels/settings/SettingsPanel";
import GuidePanel from "@/panels/GuidePanel";
import DrawPanel from "@/panels/DrawPanel";
import ReportBuilderPanel from "@/panels/ReportBuilderPanel";

type panelType = "intro" | "settings" | "guide" | "draw" | "report-builder";

const useNavBar = () => {
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

  const buttonStyles =
    "flex flex-row items-center gap-1 p-3 cursor-pointer text-(--link) hover:text-(--link-hover) bg-white/10 hover:bg-white/15";
  const panelStyles = `
    absolute
    left-18
    top-0
    h-full
    w-120
    z-1000

    bg-(--background)/95
    border-l border-white/10

    transform-gpu
    will-change-transform
    transition-all
    duration-300
    ease-[cubic-bezier(0.22,1,0.36,1)]

    ${showPanel ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}
  `;

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
      default:
        return null;
    }
  };
  return {
    showPanel,
    setShowPanel,
    panel,
    setPanel,
    handleTogglePanel,
    buttonStyles,
    panelStyles,
    getActivePanel,
  };
};

export default useNavBar;
