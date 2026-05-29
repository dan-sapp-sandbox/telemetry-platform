import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useAircraftDetails from "./useAircraftDetails";
import { Locate, X } from "lucide-react";

const AircraftDetails = () => {
  const {
    // aircraft,
    visibleAircraft,
    selectedAircraft,
    handleSetSelectedAircraft,
    trackedEntityId,
    trackSelectedAircraft,
    untrackSelectedAircraft,
  } = useAircraftDetails();
  return (
    <div className="flex h-full">
      <div className="flex flex-col w-[45%] overflow-y-auto scrollbar-hide">
        {visibleAircraft.map((entry, index) => {
          const getBackgroundStyles = () => {
            if (index % 2 === 0) {
              if (selectedAircraft?.icao === entry.icao) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-800/50";
            } else {
              if (selectedAircraft?.icao === entry.icao) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-700/50";
            }
          };
          return (
            <div
              key={entry.icao}
              className={cn([
                "cursor-pointer px-4 py-1.5 md:py-1 transition-colors text-xs md:text-sm text-(--text)/80 hover:bg-blue-400/30",
                getBackgroundStyles(),
              ])}
              onClick={() => handleSetSelectedAircraft(entry)}
            >
              {entry.callsign}
            </div>
          );
        })}
      </div>
      <Separator orientation="vertical" />
      {selectedAircraft ? (
        <div className="flex flex-col flex-1 p-2 xl:p-4 text-sm md:text-base text-(--text)/80 gap-6">
          <div className="flex flex-col xl:gap-2">
            <div className="flex justify-between">
              <div className="text-base lg:text-lg font-bold">Selected Aircraft</div>
              <X className="size-4 md:size-6" onClick={() => handleSetSelectedAircraft(null)} />
            </div>
            <div className="text-sm xl:text-base">Callsign: {selectedAircraft.callsign}</div>
            <div className="text-sm xl:text-base">Country of Origin: {selectedAircraft.origin_country}</div>
            <div className="text-sm xl:text-base">Speed: {selectedAircraft.velocity_mps}m/s</div>
            <div className="text-sm xl:text-base">Altitude: {selectedAircraft.altitude_m}m</div>
            <div
              className="text-sm xl:text-base flex items-center gap-2 cursor-pointer hover:text-(--text-hover)"
              onClick={trackedEntityId === selectedAircraft.icao ? untrackSelectedAircraft : trackSelectedAircraft}
            >
              <Locate className="size-3 xl:size-4" />
              {trackedEntityId === selectedAircraft.icao ? "Stop Tracking" : "Track"}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-col flex-1 p-4 gap-2 text-(--text)/80">
          <div className="text-sm">No selection</div>
          <div className="text-sm p-3 rounded-lg bg-zinc-800/40 border border-white/10">
            Select a aircraft to inspect
          </div>
        </div>
      )}
    </div>
  );
};

export default AircraftDetails;
