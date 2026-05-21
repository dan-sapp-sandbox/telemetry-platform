import { ArrowBigLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { backButtonStyles, backIconStyles } from "../utils";
import useLayersPallet from "./useLayersPallet";

export const wrapperStyles = cn(["group flex flex-col items-center justify-center gap-px", "w-16 md:w-18 xl:w-20 "]);
export const buttonStyles = cn([
  "bg-cover bg-center bg-no-repeat rounded-xl",
  "border border-emerald-400/10 group-hover:border-emerald-400/40",
  "w-14 h-12 md:w-16 md:h-16 xl:w-18 xl:h-18 p-0",
]);
export const buttonTextStyles = "text-(--text)/70 text-xs lg:text-sm group-hover:text-emerald-400/70";

const LayersPallet = ({ goBack }: { goBack: () => void }) => {
  const { layer, handleChangeLayer } = useLayersPallet();
  return (
    <div className="flex flex-col gap-1 lg:gap-4 xl:gap-6">
      <div className="flex justify-between">
        <div className="w-10" />
        <div className="text-(--text)/80 text-sm md:text-base">Layers</div>
        <button className={backButtonStyles} onClick={goBack}>
          <ArrowBigLeft className={backIconStyles} />
        </button>
      </div>
      <div className="flex flex-col items-center md:flex-row gap-1 md:gap-3">
        <div className="flex gap-3">
          <div className={wrapperStyles}>
            <button
              className={cn([
                buttonStyles,
                "bg-[url('/satellite-btn.png')]",
                layer === "satellite" ? "border-emerald-400/80" : "",
              ])}
              onClick={() => handleChangeLayer("satellite")}
            ></button>
            <span className={cn([buttonTextStyles, layer === "satellite" ? "text-emerald-400/80" : ""])}>
              Satellite
            </span>
          </div>
          <div className={wrapperStyles}>
            <button
              className={cn([buttonStyles, "bg-[url('/osm-btn.png')]", layer === "osm" ? "border-emerald-400/80" : ""])}
              onClick={() => handleChangeLayer("osm")}
            ></button>
            <span className={cn([buttonTextStyles, layer === "satellite" ? "text-emerald-400/80" : ""])}>OSM</span>
          </div>
        </div>
        <div className="flex gap-3">
          <div className={wrapperStyles}>
            <button
              className={cn([
                buttonStyles,
                "bg-[url('/esrisat-btn.png')]",
                layer === "esriSat" ? "border-emerald-400/80" : "",
              ])}
              onClick={() => handleChangeLayer("esriSat")}
            ></button>
            <span className={cn([buttonTextStyles, layer === "esriSat" ? "text-emerald-400/80" : ""])}>ESRI</span>
          </div>
          <div className={wrapperStyles}>
            <button
              className={cn([
                buttonStyles,
                "bg-[url('/population-btn.png')]",
                layer === "population-density" ? "border-emerald-400/80" : "",
              ])}
              onClick={() => handleChangeLayer("population-density")}
            ></button>
            <span className={cn([buttonTextStyles, layer === "population-density" ? "text-emerald-400/80" : ""])}>
              Population
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayersPallet;
