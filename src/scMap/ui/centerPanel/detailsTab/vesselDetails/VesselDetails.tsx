import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useVesselDetails from "./useVesselDetails";
import { Locate, X } from "lucide-react";

const VesselDetails = () => {
  const {
    vessels,
    selectedVessel,
    handleSetSelectedVessel,
    trackSelectedVessel,
    untrackSelectedVessel,
    trackedEntityId,
  } = useVesselDetails();
  return (
    <div className="flex h-full">
      <div className="flex flex-col w-[45%] overflow-y-auto scrollbar-hide">
        {vessels.map((vessel, index) => {
          const getBackgroundStyles = () => {
            if (index % 2 === 0) {
              if (selectedVessel?.mmsi === vessel.mmsi) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-800/50";
            } else {
              if (selectedVessel?.mmsi === vessel.mmsi) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-700/50";
            }
          };
          return (
            <div
              key={vessel.mmsi}
              className={cn([
                "cursor-pointer px-4 py-1.5 md:py-1 transition-colors text-xs md:text-sm text-(--text)/80 hover:bg-blue-400/30",
                getBackgroundStyles(),
              ])}
              onClick={() => handleSetSelectedVessel(vessel)}
            >
              {vessel.ship_name}
            </div>
          );
        })}
      </div>
      <Separator orientation="vertical" />
      {selectedVessel ? (
        <div className="flex flex-col flex-1 p-4 text-sm md:text-base text-(--text)/80 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div className="underline">Selected</div>
              <X className="size-4 md:size-6" onClick={() => handleSetSelectedVessel(null)} />
            </div>
            <div className="">{selectedVessel.ship_name}</div>
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-(--text-hover)"
              onClick={trackedEntityId === selectedVessel.mmsi.toString() ? untrackSelectedVessel : trackSelectedVessel}
            >
              <Locate className="size-4" />
              {trackedEntityId === selectedVessel.mmsi.toString() ? "Stop Tracking" : "Track"}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-col flex-1 p-4 gap-2 text-(--text)/80">
          <div className="text-sm">No selection</div>
          <div className="text-sm p-3 rounded-lg bg-zinc-800/40 border border-white/10">Select a vessel to inspect</div>
        </div>
      )}
    </div>
  );
};

export default VesselDetails;
