import { Slash, Hexagon, Dot } from "lucide-react";
import useDrawTab from "./useDrawTab";
import { cn } from "@/lib/utils";
import DrawDetails from "./drawDetails/DrawDetails";
import { Separator } from "@/components/ui/separator";

export const wrapperStyles = cn(["group flex flex-col items-center justify-center gap-px"]);
export const buttonStyles = cn([
  "flex justify-center items-center rounded-xl",
  // "border border-emerald-400/10 group-hover:border-emerald-400/40",
  "bg-slate-700/60 border border-emerald-400/10 hover:bg-slate-700/90 group-hover:border-emerald-400/40",
  "w-6 h-6 md:w-8 md:h-8 xl:w-10 xl:h-10 p-0",
]);
export const buttonTextStyles = "text-(--text)/70 text-xs group-hover:text-emerald-400/70";
export const iconStyles = "text-(--text)/70 lg:size-4 xl:size-6 group-hover:text-emerald-400/70";
const DrawTab = () => {
  const { handleChangeDrawMode, drawMode } = useDrawTab();

  return (
    <div className="flex justify-center items-center h-full">
      <DrawDetails />
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-3 h-full p-3">
        <div className={wrapperStyles}>
          <button
            className={cn([buttonStyles, drawMode === "point" ? "bg-emerald-400/35" : ""])}
            onClick={() => handleChangeDrawMode("point")}
          >
            <Dot className={iconStyles} />
          </button>
        </div>
        <div className={wrapperStyles}>
          <button
            className={cn([buttonStyles, drawMode === "polyline" ? "bg-emerald-400/35" : ""])}
            onClick={() => handleChangeDrawMode("polyline")}
          >
            <Slash className={iconStyles} />
          </button>
        </div>
        <div className={wrapperStyles}>
          <button
            className={cn([buttonStyles, drawMode === "polygon" ? "bg-emerald-400/35" : ""])}
            onClick={() => handleChangeDrawMode("polygon")}
          >
            <Hexagon className={iconStyles} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawTab;
