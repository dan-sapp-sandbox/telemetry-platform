import { Plane, Ship } from "lucide-react";
import { cn } from "@/lib/utils";
import { iconStyles } from "../utils";
import useLayersPallet from "./useLayersPallet";

export const wrapperStyles = cn(["group flex flex-col items-center justify-center gap-px", "w-16 md:w-18 xl:w-20 "]);
export const buttonStyles = cn([
  "bg-cover bg-center bg-no-repeat rounded-xl",
  "border border-emerald-400/10 group-hover:border-emerald-400/40",
  "w-10 h-10 md:w-12 md:h-12 xl:w-16 xl:h-16 p-0",
]);
export const buttonTextStyles = "text-(--text)/70 text-xs lg:text-sm group-hover:text-emerald-400/70";

const LayersPallet = () => {
  const { layer, handleChangeLayer, dataLayer, handleChangeDataLayer } = useLayersPallet();
  return (
    <div className="flex flex-col md:gap-1 lg:gap-3">
      <div className="flex flex-col gap-2">
        <div className="w-full text-center text-(--text)/80 text-sm lg:text-base">Base Layer</div>
        <div className="flex md:gap-2">
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
        </div>
      </div>
      <div className="flex flex-col md:gap-2">
        <div className="w-full text-center text-(--text)/80 text-sm lg:text-base">Data Layer</div>
        <div className="flex md:gap-2">
          <div className={wrapperStyles}>
            <button
              className={cn([
                buttonStyles,
                "flex justify-center items-center",
                dataLayer === "vessels" ? "border-emerald-400/80" : "",
              ])}
              onClick={() => handleChangeDataLayer("vessels")}
            >
              <Ship className={cn([iconStyles])} />
            </button>
            <span className={cn([buttonTextStyles, dataLayer === "vessels" ? "text-emerald-400/80" : ""])}>AIS</span>
          </div>
          <div className={wrapperStyles}>
            <button
              className={cn([
                buttonStyles,
                "flex justify-center items-center",
                dataLayer === "aircraft" ? "border-emerald-400/80" : "",
              ])}
              onClick={() => handleChangeDataLayer("aircraft")}
            >
              <Plane className={cn([iconStyles])} />
            </button>
            <span className={cn([buttonTextStyles, dataLayer === "aircraft" ? "text-emerald-400/80" : ""])}>ADS-B</span>
          </div>
          <div className={wrapperStyles}>
            <button
              className={cn([
                buttonStyles,
                "bg-[url('/population-btn.png')]",
                dataLayer === "population-density" ? "text-emerald-400/80" : "",
              ])}
              onClick={() => handleChangeDataLayer("population-density")}
            ></button>
            <span className={cn([buttonTextStyles, dataLayer === "population-density" ? "text-emerald-400/80" : ""])}>
              Population
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayersPallet;
