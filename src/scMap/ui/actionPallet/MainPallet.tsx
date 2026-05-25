import { buttonStyles, iconStyles, buttonTextStyles, type actionPanel } from "./utils";
import { Edit, Layers, RefreshCcw } from "lucide-react";

const MainPallet = ({
  handleSetActivePanel,
  handleResetCamera,
}: {
  handleSetActivePanel: (type: actionPanel | null) => void;
  handleResetCamera: () => void;
}) => {
  return (
    <div className="flex flex-col gap-3 p-2 h-full w-full">
      <div className="flex justify-around gap-3">
        <button className={buttonStyles} onClick={() => handleSetActivePanel("draw")}>
          <Edit className={iconStyles} />
          <span className={buttonTextStyles}>Draw</span>
        </button>
        <button className={buttonStyles} onClick={() => handleSetActivePanel("layers")}>
          <Layers className={iconStyles} />
          <span className={buttonTextStyles}>Layers</span>
        </button>
        <button className={buttonStyles} onClick={handleResetCamera}>
          <RefreshCcw className={iconStyles} />
          <span className={buttonTextStyles}>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default MainPallet;
