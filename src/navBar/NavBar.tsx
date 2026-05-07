import type { Dispatch, SetStateAction } from "react";
import ThemeToggle from "@/components/themeToggle";
import type { Theme } from "@/components/themeToggle/useTheme";
import { Sprout, Info, Settings, X } from "lucide-react";
import useNavBar from "./useNavBar";

const NavBar = ({ theme, setTheme }: { theme: string; setTheme: Dispatch<SetStateAction<Theme>> }) => {
  const navBarState = useNavBar();
  //TODO: selected state for buttons
  //TODO: add tooltips for buttons (make buttons a component)

  return (
    <div className="relative h-full">
      <div className="relative z-2000 py-8 h-full w-16 flex flex-col justify-between items-center bg-(--header-bg)">
        <div className="flex flex-col items-center gap-1">
          <div onClick={() => navBarState.handleTogglePanel("guide")} className={navBarState.buttonStyles}>
            <Sprout className="size-8" />
          </div>

          <div onClick={() => navBarState.handleTogglePanel("settings")} className={navBarState.buttonStyles}>
            <Settings className="size-8" />
          </div>

          <div onClick={() => navBarState.handleTogglePanel("intro")} className={navBarState.buttonStyles}>
            <Info className="size-8" />
          </div>
        </div>

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
