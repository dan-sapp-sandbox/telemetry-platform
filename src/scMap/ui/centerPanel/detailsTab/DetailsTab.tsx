import { Locate } from "lucide-react";
import useDetailsTab from "./useDetailsTab";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const DetailsTab = () => {
  const { vessels, selectedVessel, setSelectedVessel, flyToVessel, activePanel } = useDetailsTab();
  if (activePanel === "vessels") {
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
                  "cursor-pointer px-2 py-1 transition-colors text-(--text) hover:bg-blue-400/30",
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
          <div className="flex flex-col flex-1 pl-2">
            <div className="bg-slate-800/50 py-2">Name: {selectedVessel.name}</div>
            <div className="bg-slate-700/50 py-2">Type: {selectedVessel.type}</div>
            <div
              className="flex items-center gap-2 cursor-pointer py-2 bg-slate-800/50 hover-bg-blue-800/50 "
              onClick={() => flyToVessel(selectedVessel)}
            >
              <Locate className="size-4" />
              <div className="hover:text-blue-700">Center Map on Vessel</div>
            </div>
          </div>
        ) : (
          <div className="flex-col flex-1 pl-2 gap-2">
            <div className="text-xs text-zinc-400">No selection</div>
            <div className="p-3 rounded-lg bg-zinc-800/40 border border-white/10">
              Select a vessel or object to inspect
            </div>
          </div>
        )}
      </div>
    );
  }
  return <div>Choose a Topic from Action Pallet</div>;
};

export default DetailsTab;
