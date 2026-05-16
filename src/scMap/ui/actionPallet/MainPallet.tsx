import { buttonStyles, iconStyles, buttonTextStyles, type actionPanel } from "./utils";
import { Edit, Plane, Ship, Layers } from "lucide-react";

const MainPallet = ({ setActivePanel }: { setActivePanel: (type: actionPanel | null) => void }) => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-4 px-2 h-full">
      <div className="grid grid-cols-4 gap-3 content-start">
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
