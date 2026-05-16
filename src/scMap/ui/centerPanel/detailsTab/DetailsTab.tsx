import { Locate } from "lucide-react";
import useDetailsTab from "./useDetailsTab";
import { Separator } from "@/components/ui/separator";

const DetailsTab = () => {
  const { vessels, selectedVessel, setSelectedVessel, flyToVessel } = useDetailsTab();
  return (
    <div className="flex h-full">
      <div className="flex-col w-1/3 p-1">
        {vessels.map((vessel) => (
          <div key={vessel.id} className="cursor-pointer hover:text-blue-300" onClick={() => setSelectedVessel(vessel)}>
            {vessel.name}
          </div>
        ))}
      </div>
      <Separator orientation="vertical" />
      <div className="flex-col flex-1 pl-2">
        {selectedVessel ? (
          <>
            <div>Name: {selectedVessel.name}</div>
            <div>Type: {selectedVessel.type}</div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => flyToVessel(selectedVessel)}>
              <Locate className="size-4" />
              <div>Center Map on Vessel</div>
            </div>
          </>
        ) : (
          <>
            <div className="text-xs text-zinc-400">No selection</div>
            <div className="p-3 rounded-lg bg-zinc-800/40 border border-white/10">
              Select a vessel or object to inspect
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DetailsTab;
