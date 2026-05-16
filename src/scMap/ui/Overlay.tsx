import MiniMap from "./MiniMap";
import { Edit, Plane, Ship } from "lucide-react";
import ActionPallet from "./actionPallet/ActionPallet";
import { cn } from "@/lib/utils";
import CenterPanel from "./centerPanel/CenterPanel";

const Overlay = () => {
  const miniMapSectionStyles = cn([
    "flex items-center bg-zinc-800 lg:rounded-tr-2xl pl-2",
    "h-42 w-42 lg:h-55 lg:w-63 xl:h-75 xl:w-85 gap-2",
  ]);
  const miniMapWrapperStyles = cn([
    "relative rounded-2xl overflow-hidden border border-white/10 shadow-xl",
    "h-32 w-32 lg:h-50 lg:w-50 xl:h-70 xl:w-70",
  ]);
  const buttonStyles = cn([
    "flex items-center justify-center rounded-xl bg-blue-600/30 border border-white/10 hover:bg-blue-600/80 hover:border-cyan-400/40",
    "size-6 lg:size-7 xl:size-9 p-1",
  ]);
  const iconStyles = "text-zinc-300";
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 flex items-end cursor-default">
      <div className={miniMapSectionStyles}>
        <div className={miniMapWrapperStyles}>
          <MiniMap />
        </div>
        <div className="hidden lg:flex flex-col gap-8 w-10">
          <button className={buttonStyles}>
            <Edit className={iconStyles} />
          </button>
          <button className={buttonStyles}>
            <Ship className={iconStyles} />
          </button>
          <button className={buttonStyles}>
            <Plane className={iconStyles} />
          </button>
        </div>
      </div>
      <CenterPanel />
      <ActionPallet />
    </div>
  );
};

export default Overlay;
