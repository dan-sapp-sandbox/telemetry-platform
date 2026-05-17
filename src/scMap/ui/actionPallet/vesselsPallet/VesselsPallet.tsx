import { ArrowBigLeft } from "lucide-react";
import { backButtonStyles, backIconStyles } from "../utils";
import { Switch } from "@/components/ui/switch";
import useVesselPallet from "./useVesselsPallet";

const VesselsPallet = ({ goBack }: { goBack: () => void }) => {
  const {
    showVessels,
    handleToggleShowVessels,
    showVesselNames,
    handleToggleShowVesselNames,
    showVesselPaths,
    handleToggleShowVesselPaths,
  } = useVesselPallet();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="w-10" />
        <div className="text-(--text)/80">Vessels</div>
        <button className={backButtonStyles} onClick={goBack}>
          <ArrowBigLeft className={backIconStyles} />
        </button>
      </div>
      <div className="flex items-center gap-6">
        <Switch checked={showVessels} onCheckedChange={handleToggleShowVessels} />
        <span className="text-sm text-(--text)/80 font-bold">Show Vessels on Map</span>
      </div>
      <div className="flex items-center gap-6">
        <Switch checked={showVesselNames} onCheckedChange={handleToggleShowVesselNames} />
        <span className="text-sm text-(--text)/80 font-bold">Show Vessel Names on Map</span>
      </div>
      <div className="flex items-center gap-6">
        <Switch checked={showVesselPaths} onCheckedChange={handleToggleShowVesselPaths} />
        <span className="text-sm text-(--text)/80 font-bold">Show Vessel Paths on Map</span>
      </div>
    </div>
  );
};

export default VesselsPallet;
