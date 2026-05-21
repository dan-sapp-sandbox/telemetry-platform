import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useVesselDetails from "./useVesselDetails";

const VesselDetails = () => {
  const { vessels, selectedVessel, handleSetSelectedVessel } = useVesselDetails();
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
                "cursor-pointer px-4 py-1 transition-colors text-sm text-(--text)/80 hover:bg-blue-400/30",
                getBackgroundStyles(),
              ])}
              onClick={() => handleSetSelectedVessel(vessel)}
            >
              {vessel.name}
            </div>
          );
        })}
      </div>
      <Separator orientation="vertical" />
      {selectedVessel ? (
        <div className="flex flex-col flex-1 p-4 text-(--text)/80 gap-6">
          <div className="flex flex-col gap-2">
            <div className="">Name: {selectedVessel.name}</div>
            <div>{selectedVessel.routeName}</div>
          </div>
          {/* <button
            className={cn([
              "w-fit flex items-center gap-2 cursor-pointer",
              "bg-zinc-600/80 hover-bg-blue-800/50 hover:text-emerald-400/50 p-2 hover:border-emerald-400/30",
            ])}
            onClick={() => flyToVessel(selectedVessel)}
          >
            <Locate className="size-5" />
            <span className="text-sm">Center Map on Vessel</span>
          </button> */}
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
