import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useAircraftDetails from "./useAircraftDetails";
import { X } from "lucide-react";

const AircraftDetails = () => {
  const { aircraft, selectedAircraft, handleSetSelectedAircraft } = useAircraftDetails();
  return (
    <div className="flex h-full">
      <div className="flex flex-col w-[45%] overflow-y-auto scrollbar-hide">
        {aircraft.map((entry, index) => {
          const getBackgroundStyles = () => {
            if (index % 2 === 0) {
              if (selectedAircraft?.id === entry.id) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-800/50";
            } else {
              if (selectedAircraft?.id === entry.id) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-700/50";
            }
          };
          return (
            <div
              key={entry.id}
              className={cn([
                "cursor-pointer px-4 py-1.5 md:py-1 transition-colors text-xs md:text-sm text-(--text)/80 hover:bg-blue-400/30",
                getBackgroundStyles(),
              ])}
              onClick={() => handleSetSelectedAircraft(entry)}
            >
              {entry.name}
            </div>
          );
        })}
      </div>
      <Separator orientation="vertical" />
      {selectedAircraft ? (
        <div className="flex flex-col flex-1 p-4 text-sm md:text-base text-(--text)/80 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="underline">Selected</div>
              <X className="size-4 md:size-6" onClick={() => handleSetSelectedAircraft(null)} />
            </div>
            <div className="">{selectedAircraft.name}</div>
            <div>{selectedAircraft.routeName}</div>
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
