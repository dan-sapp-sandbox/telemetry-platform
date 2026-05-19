import { ArrowBigLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { backButtonStyles, backIconStyles } from "../utils";
import useAircraftPallet from "./useAircraftPallet";

const AircraftPallet = ({ goBack }: { goBack: () => void }) => {
  const {
    showAircraft,
    showAircraftNames,
    // showAircraftPaths,
    handleToggleShowAircraft,
    handleToggleShowAircraftNames,
    // handleToggleShowAircraftPaths,
  } = useAircraftPallet();
  return (
    <div className="flex flex-col gap-3 lg:gap-4 xl:gap-6">
      <div className="flex justify-between">
        <div className="w-10" />
        <div className="text-(--text)/80">Aircraft</div>
        <button className={backButtonStyles} onClick={goBack}>
          <ArrowBigLeft className={backIconStyles} />
        </button>
      </div>
      <div className="flex items-center gap-6 cursor-pointer" onClick={handleToggleShowAircraft}>
        <Switch checked={showAircraft} onCheckedChange={handleToggleShowAircraft} />
        <span className="text-sm text-(--text)/80 font-bold">Show Aircrafts on Map</span>
      </div>
      <div className="flex items-center gap-6 cursor-pointer" onClick={handleToggleShowAircraftNames}>
        <Switch checked={showAircraftNames} onCheckedChange={handleToggleShowAircraftNames} />
        <span className="text-sm text-(--text)/80 font-bold">Show Aircraft Names on Map</span>
      </div>
      {/* <div className="flex items-center gap-6 cursor-pointer" onClick={handleToggleShowAircraftPaths}>
        <Switch checked={showAircraftPaths} onCheckedChange={handleToggleShowAircraftPaths} />
        <span className="text-sm text-(--text)/80 font-bold">Show Vessel Paths on Map</span>
      </div> */}
    </div>
  );
};

export default AircraftPallet;
