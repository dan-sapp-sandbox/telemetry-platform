import useAircraftPanel from "./useAircraftPanel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Locate, Edit2 } from "lucide-react";

const AircraftPanel = () => {
  // TODO: timeseries data
  // TODO: restrict to aircraft in Camera BBox
  const {
    aircraft,
    flyToAircraft,
    showAircraft,
    handleToggleShowAircraft,
    showAircraftPaths,
    handleToggleShowAircraftPaths,
  } = useAircraftPanel();
  return (
    <div className="w-full flex flex-col gap-4 md:gap-12 p-8">
      <div className="text-2xl font-bold">Aircraft</div>
      <div className="flex items-center gap-4">
        <Switch checked={showAircraft} onCheckedChange={handleToggleShowAircraft} />
        <span className="text-(--text) font-bold">Show Aircraft on Map</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch checked={showAircraftPaths} onCheckedChange={handleToggleShowAircraftPaths} />
        <span className="text-(--text) font-bold">Show Aircraft Paths on Map</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-xl font-bold">List of Aircraft</div>
        <div className="flex flex-col gap-2 p-2 bg-(--foreground)/60">
          {!aircraft.length && <div>No Aircraft Available</div>}
          {aircraft.map((entry) => {
            return (
              <div key={entry.id} className="flex flex-col p-2 gap-2 bg-(--background)">
                <div className="flex flex-row p-2 gap-2 items-center">
                  <span>{entry.name}</span>
                  <Button size="icon" onClick={() => {}}>
                    <Edit2 />
                  </Button>
                  <Button variant="secondary" size="icon" onClick={() => flyToAircraft(entry)}>
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

export default AircraftPanel;
