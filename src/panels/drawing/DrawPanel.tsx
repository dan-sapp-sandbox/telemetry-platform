import { Button } from "@/components/ui/button";
import useDrawPanel from "./useDrawPanel";

const DrawPanel = () => {
  const { handleChangeDrawMode } = useDrawPanel();
  return (
    <div className="w-full flex flex-col gap-4 md:gap-12 p-8">
      <div className="text-2xl font-bold">Draw</div>
      <div className="flex flex-col gap-2">
        <Button variant="default" onClick={() => handleChangeDrawMode("point")}>
          Point
        </Button>

        <Button variant="default" onClick={() => handleChangeDrawMode("polyline")}>
          Line
        </Button>

        <Button variant="default" onClick={() => handleChangeDrawMode("polygon")}>
          Polygon
        </Button>

        <Button variant="default" onClick={() => handleChangeDrawMode(null)}>
          Cancel
        </Button>
      </div>

      <div>List of Drawn Features</div>
    </div>
  );
};

export default DrawPanel;
