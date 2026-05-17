import { Locate } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useVesselDetails from "./useVesselDetails";

const VesselDetails = () => {
  const { vessels, selectedVessel, setSelectedVessel, flyToVessel } = useVesselDetails();
  return (
    <div className="flex h-full">
      <div className="flex flex-col w-1/3 overflow-y-auto scrollbar-hide">
        {vessels.map((vessel, index) => {
          const getBackgroundStyles = () => {
            if (index % 2 === 0) {
              if (selectedVessel?.id === vessel.id) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-800/50";
            } else {
              if (selectedVessel?.id === vessel.id) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-700/50";
            }
          };
          return (
            <div
              key={vessel.id}
              className={cn([
                "cursor-pointer px-2 py-1 transition-colors text-(--text)/80 hover:bg-blue-400/30",
                getBackgroundStyles(),
              ])}
              onClick={() => setSelectedVessel(vessel)}
            >
              {vessel.name}
            </div>
          );
        })}
      </div>
      <Separator orientation="vertical" />
      {selectedVessel ? (
        <div className="flex flex-col flex-1 pl-2 text-(--text)/80">
          <div className="bg-slate-800/50 py-1">Name: {selectedVessel.name}</div>
          <div className="bg-slate-700/50 py-1">Type: {selectedVessel.type}</div>
          <div
            className="flex items-center gap-2 cursor-pointer py-1 bg-slate-800/50 hover-bg-blue-800/50 hover:text-blue-300/80"
            onClick={() => flyToVessel(selectedVessel)}
          >
            <Locate className="size-4" />
            <div className="">Center Map on Vessel</div>
          </div>
        </div>
      ) : (
        <div className="flex-col flex-1 pl-2 gap-2 text-(--text)/80">
          <div className="text-sm">No selection</div>
          <div className="text-sm p-3 rounded-lg bg-zinc-800/40 border border-white/10">Select a vessel to inspect</div>
        </div>
      )}
    </div>
  );
};

export default VesselDetails;
