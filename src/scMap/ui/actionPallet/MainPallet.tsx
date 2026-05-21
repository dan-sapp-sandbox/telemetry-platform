import { buttonStyles, iconStyles, buttonTextStyles, type actionPanel } from "./utils";
import { Edit, Plane, Ship, Layers } from "lucide-react";

const MainPallet = ({ handleSetActivePanel }: { handleSetActivePanel: (type: actionPanel | null) => void }) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 p-2 h-full w-full">
      <div className="flex justify-around gap-3">
        <button className={buttonStyles} onClick={() => handleSetActivePanel("draw")}>
          <Edit className={iconStyles} />
          <span className={buttonTextStyles}>Draw</span>
        </button>

        <button className={buttonStyles} onClick={() => handleSetActivePanel("vessels")}>
          <Ship className={iconStyles} />
          <span className={buttonTextStyles}>Vessels</span>
        </button>
      </div>
      <div className="flex justify-around gap-3">
        <button className={buttonStyles} onClick={() => handleSetActivePanel("aircraft")}>
          <Plane className={iconStyles} />
          <span className={buttonTextStyles}>Aircraft</span>
        </button>

        <button className={buttonStyles} onClick={() => handleSetActivePanel("layers")}>
          <Layers className={iconStyles} />
          <span className={buttonTextStyles}>Layers</span>
        </button>
      </div>
    </div>
  );
};

export default MainPallet;
