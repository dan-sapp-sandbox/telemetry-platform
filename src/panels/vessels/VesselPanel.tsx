import useVesselPanel from "./useVesselPanel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Locate, Edit2 } from "lucide-react";

const VesselPanel = () => {
  // TODO: timeseries data
  // TODO: restrict to vessels in Camera BBox
  const { vessels, flyToVessel, showVessels, handleToggleShowVessels, showVesselPaths, handleToggleShowVesselPaths } =
    useVesselPanel();
  return (
    <div className="w-full flex flex-col gap-4 md:gap-12 p-8">
      <div className="text-2xl font-bold">Vessels</div>
      <div className="flex items-center gap-4">
        <Switch checked={showVessels} onCheckedChange={handleToggleShowVessels} />
        <span className="text-(--text) font-bold">Show Vessels on Map</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch checked={showVesselPaths} onCheckedChange={handleToggleShowVesselPaths} />
        <span className="text-(--text) font-bold">Show Vessel Paths on Map</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-xl font-bold">List of Vessels</div>
        <div className="flex flex-col gap-2 p-2 bg-(--foreground)/60">
          {!vessels.length && <div>No Vessels Available</div>}
          {vessels.map((vessel) => {
            return (
              <div key={vessel.id} className="flex flex-col p-2 gap-2 bg-(--background)">
                <div className="flex flex-row p-2 gap-2 items-center">
                  <span>{vessel.name}</span>
                  <Button size="icon" onClick={() => {}}>
                    <Edit2 />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={() => flyToVessel(vessel)}>
                    <Locate />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VesselPanel;
