import { Slash, Hexagon, Dot, ArrowBigLeft } from "lucide-react";
import { backButtonStyles, backIconStyles } from "../utils";
import useDrawPallet from "./useDrawPallet";
import { cn } from "@/lib/utils";
import { buttonStyles, iconStyles, buttonTextStyles } from "../utils";

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
      <div className="flex justify-between">
        <button
          className={cn([buttonStyles, drawMode === "point" ? "bg-emerald-400/35" : ""])}
          onClick={() => handleChangeDrawMode("point")}
        >
          <Dot className={iconStyles} />
          <span className={buttonTextStyles}>Point</span>
        </button>
        <button
          className={cn([buttonStyles, drawMode === "polyline" ? "bg-emerald-400/35" : ""])}
          onClick={() => handleChangeDrawMode("polyline")}
        >
          <Slash className={iconStyles} />
          <span className={buttonTextStyles}>Line</span>
        </button>
        <button
          className={cn([buttonStyles, drawMode === "polygon" ? "bg-emerald-400/35" : ""])}
          onClick={() => handleChangeDrawMode("polygon")}
        >
          <Hexagon className={iconStyles} />
          <span className={buttonTextStyles}>Polygon</span>
        </button>
      </div>
      <div className="self-end text-sm text-(--text)/70">(double click to end drawing)</div>
    </div>
  );
};

export default DrawPallet;
