import { Slash, Hexagon, Dot, ArrowBigLeft } from "lucide-react";
import { backButtonStyles, backIconStyles, iconStyles } from "../utils";
import useDrawPallet from "./useDrawPallet";
import { cn } from "@/lib/utils";

export const wrapperStyles = cn(["group flex flex-col items-center justify-center gap-px", "w-14 md:w-18 xl:w-22 "]);
export const buttonStyles = cn([
  "flex justify-center items-center rounded-xl",
  // "border border-emerald-400/10 group-hover:border-emerald-400/40",
  "bg-slate-700/60 border border-emerald-400/10 hover:bg-slate-700/90 group-hover:border-emerald-400/40",
  "w-12 h-12 md:w-16 md:h-16 xl:w-20 xl:h-20 p-0",
]);
export const buttonTextStyles = "text-(--text)/70 text-xs md:text-sm group-hover:text-emerald-400/70";

const DrawPallet = ({ goBack }: { goBack: () => void }) => {
  const { handleChangeDrawMode, drawMode } = useDrawPallet();
  // TODO: upload/download geojson
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex justify-between">
        <div className="w-10" />
        <div className="text-(--text)/80">Draw</div>
        <button className={backButtonStyles} onClick={goBack}>
          <ArrowBigLeft className={backIconStyles} />
        </button>
      </div>
      <div className="flex gap-1 md:gap-3">
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
  );
};

export default DrawPallet;
