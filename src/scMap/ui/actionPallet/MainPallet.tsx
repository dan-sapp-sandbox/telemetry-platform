import { buttonStyles, iconStyles, buttonTextStyles, type actionPanel } from "./utils";
import { Edit, Plane, Ship, Layers } from "lucide-react";

const MainPallet = ({ setActivePanel }: { setActivePanel: (type: actionPanel | null) => void }) => {
  return (
    <div className="flex flex-col gap-4 p-2 h-full w-full">
      <div className="flex gap-3">
        <button className={buttonStyles} onClick={() => setActivePanel("draw")}>
          <Edit className={iconStyles} />
          <span className={buttonTextStyles}>Draw</span>
        </button>

        <button className={buttonStyles} onClick={() => setActivePanel("vessels")}>
          <Ship className={iconStyles} />
          <span className={buttonTextStyles}>Vessels</span>
        </button>

        <button className={buttonStyles} onClick={() => setActivePanel("aircraft")}>
          <Plane className={iconStyles} />
          <span className={buttonTextStyles}>Aircraft</span>
        </button>

        <button className={buttonStyles} onClick={() => setActivePanel("layers")}>
          <Layers className={iconStyles} />
          <span className={buttonTextStyles}>Layers</span>
        </button>
      </div>
    </div>
  );
};

export default MainPallet;
