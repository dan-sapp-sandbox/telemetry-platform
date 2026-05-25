import { Slash, Hexagon, Dot } from "lucide-react";
import useDrawTab from "./useDrawTab";
import { cn } from "@/lib/utils";
import DrawDetails from "../detailsTab/drawDetails/DrawDetails";
import { Separator } from "@/components/ui/separator";

export const wrapperStyles = cn(["group flex flex-col items-center justify-center gap-px", "w-14 md:w-18 xl:w-22 "]);
export const buttonStyles = cn([
  "flex justify-center items-center rounded-xl",
  // "border border-emerald-400/10 group-hover:border-emerald-400/40",
  "bg-slate-700/60 border border-emerald-400/10 hover:bg-slate-700/90 group-hover:border-emerald-400/40",
  "w-8 h-8 md:w-12 md:h-12 xl:w-16 xl:h-16 p-0",
]);
export const buttonTextStyles = "text-(--text)/70 text-xs md:text-sm group-hover:text-emerald-400/70";
export const iconStyles = "text-(--text)/70 lg:size-6 xl:size-10 group-hover:text-emerald-400/70";
const DrawTab = () => {
  const { handleChangeDrawMode, drawMode } = useDrawTab();

  return (
    <div className="flex justify-center items-center h-full gap-3 p-3">
      <DrawDetails />
      <Separator orientation="vertical" />
      <div className="flex flex-col gap-3 h-full">
        <div className="w-full flex justify-center gap-1 md:gap-3">
          <div className={wrapperStyles}>
            <button
              className={cn([buttonStyles, drawMode === "point" ? "bg-emerald-400/35" : ""])}
              onClick={() => handleChangeDrawMode("point")}
            >
              <Dot className={iconStyles} />
            </button>
            <span className={buttonTextStyles}>Point</span>
          </div>
          <div className={wrapperStyles}>
            <button
              className={cn([buttonStyles, drawMode === "polyline" ? "bg-emerald-400/35" : ""])}
              onClick={() => handleChangeDrawMode("polyline")}
            >
              <Slash className={iconStyles} />
            </button>
            <span className={buttonTextStyles}>Line</span>
          </div>
          <div className={wrapperStyles}>
            <button
              className={cn([buttonStyles, drawMode === "polygon" ? "bg-emerald-400/35" : ""])}
              onClick={() => handleChangeDrawMode("polygon")}
            >
              <Hexagon className={iconStyles} />
            </button>
            <span className={buttonTextStyles}>Polygon</span>
          </div>
        </div>
        <div className="self-end text-xs md:text-sm text-(--text)/70">(double click to finish)</div>
      </div>
    </div>
  );
};

export default DrawTab;
