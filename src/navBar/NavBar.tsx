import type { Dispatch, SetStateAction } from "react";
import ThemeToggle from "@/components/themeToggle";
import type { Theme } from "@/components/themeToggle/useTheme";
import { BriefcaseBusiness, Sprout, Settings, X, Camera, Edit, FileText, Ship, Plane } from "lucide-react";
import useNavBar from "./useNavBar";
import { ButtonTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NavBar = ({ theme, setTheme }: { theme: string; setTheme: Dispatch<SetStateAction<Theme>> }) => {
  const navBarState = useNavBar();

  return (
    <div className="relative h-full">
      <div className="relative z-2000 py-8 h-full w-12 md:w-18 flex flex-col justify-between items-center bg-(--header-bg)">
        <div className="flex flex-col items-center gap-1">
          <ButtonTooltip content="Intro">
            <div
              onClick={() => navBarState.handleTogglePanel("intro")}
              className={cn([
                navBarState.buttonStyles,
                navBarState.showPanel && navBarState.panel === "intro"
                  ? "text-(--link-selected) bg-(--alt-background)/25"
                  : "",
              ])}
            >
              <BriefcaseBusiness className={navBarState.iconStyles} />
            </div>
          </ButtonTooltip>
          <ButtonTooltip content="App Guide">
            <div
              onClick={() => navBarState.handleTogglePanel("guide")}
              className={cn([
                navBarState.buttonStyles,
                navBarState.showPanel && navBarState.panel === "guide"
                  ? "text-(--link-selected) bg-(--alt-background)/25"
                  : "",
              ])}
            >
              <Sprout className={navBarState.iconStyles} />
            </div>
          </ButtonTooltip>
          <ButtonTooltip content="Draw">
            <div
              onClick={() => navBarState.handleTogglePanel("draw")}
              className={cn([
                navBarState.buttonStyles,
                navBarState.showPanel && navBarState.panel === "draw"
                  ? "text-(--link-selected) bg-(--alt-background)/25"
                  : "",
              ])}
            >
              <Edit className={navBarState.iconStyles} />
            </div>
          </ButtonTooltip>
          <ButtonTooltip content="Vessels">
            <div
              onClick={() => navBarState.handleTogglePanel("vessels")}
              className={cn([
                navBarState.buttonStyles,
                navBarState.showPanel && navBarState.panel === "vessels"
                  ? "text-(--link-selected) bg-(--alt-background)/25"
                  : "",
              ])}
            >
              <Ship className={navBarState.iconStyles} />
            </div>
          </ButtonTooltip>
          <ButtonTooltip content="Aircraft">
            <div
              onClick={() => navBarState.handleTogglePanel("aircraft")}
              className={cn([
                navBarState.buttonStyles,
                navBarState.showPanel && navBarState.panel === "aircraft"
                  ? "text-(--link-selected) bg-(--alt-background)/25"
                  : "",
              ])}
            >
              <Plane className={navBarState.iconStyles} />
            </div>
          </ButtonTooltip>
          <ButtonTooltip content="Report Builder">
            <div
              onClick={() => navBarState.handleTogglePanel("report-builder")}
              className={cn([
                navBarState.buttonStyles,
                navBarState.showPanel && navBarState.panel === "report-builder"
                  ? "text-(--link-selected) bg-(--alt-background)/25"
                  : "",
              ])}
            >
              <FileText className={navBarState.iconStyles} />
            </div>
          </ButtonTooltip>
          <ButtonTooltip content="Settings">
            <div
              onClick={() => navBarState.handleTogglePanel("settings")}
              className={cn([
                navBarState.buttonStyles,
                navBarState.showPanel && navBarState.panel === "settings" ? "text-(--link-selected) bg-white/25" : "",
              ])}
            >
              <Settings className={navBarState.iconStyles} />
            </div>
          </ButtonTooltip>
        </div>
        <ButtonTooltip content="Take Snapshot">
          <div onClick={() => navBarState.handleTogglePanel("intro")} className={cn([navBarState.buttonStyles])}>
            <Camera className={navBarState.iconStyles} />
          </div>
        </ButtonTooltip>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
      <div className={navBarState.panelStyles}>
        <div className="h-full text-(--text) flex flex-col p-2">
          <div className="w-full flex flex-row-reverse">
            <X className="cursor-pointer" onClick={() => navBarState.setShowPanel(false)} />
          </div>

          {navBarState.getActivePanel()}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
