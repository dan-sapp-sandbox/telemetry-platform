import { Button } from "@/components/ui/button";
import useDrawPanel from "./useDrawPanel";
import { cn } from "@/lib/utils";
import { Edit, Edit2 } from "lucide-react";

const DrawPanel = () => {
  const { handleChangeDrawMode, handleDeleteEntity, handleRenameEntity, drawMode, entities, flyToDrawEntity } =
    useDrawPanel();
  // TODO: finish rename workflow
  // TODO: mobile styling
  // TODO: upload/download geojson
  return (
    <div className="w-full flex flex-col gap-4 md:gap-12 p-8">
      <div className="text-2xl font-bold">Draw</div>
      <div className="flex flex-col gap-2 items-center">
        <Button
          className={cn(["w-full", drawMode === "point" ? "bg-blue-200" : ""])}
          onClick={() => handleChangeDrawMode("point")}
        >
          Point
        </Button>
        <Button
          className={cn(["w-full", drawMode === "polyline" ? "bg-blue-200" : ""])}
          onClick={() => handleChangeDrawMode("polyline")}
        >
          Line
        </Button>
        <Button
          className={cn(["w-full", drawMode === "polygon" ? "bg-blue-200" : ""])}
          onClick={() => handleChangeDrawMode("polygon")}
        >
          Polygon
        </Button>
        <Button className="w-full" onClick={() => handleChangeDrawMode(null)}>
          Cancel
        </Button>
        <div className="text-sm">(right click to end drawing)</div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xl font-bold">List of Drawn Features</div>
        <div className="flex flex-col gap-2 p-2 bg-(--foreground)/60">
          {!entities.length && <div>No Features Added</div>}
          {entities.map((entity) => (
            <div key={entity.id} className="flex flex-col p-2 gap-2 bg-(--background)">
              <div className="flex flex-row p-2 gap-2 items-center">
                <span>{entity.name}</span>
                <Button size="icon" onClick={() => handleRenameEntity(entity.id, "new name")}>
                  <Edit2 />
                </Button>
              </div>
              <div className="flex p-2 gap-2 justify-between">
                <span className="capitalize">Type: {entity.type}</span>
                <Button variant="destructive" onClick={() => handleDeleteEntity(entity.id)}>
                  Delete
                </Button>
                <Button variant="secondary" onClick={() => flyToDrawEntity(entity)}>
                  Fly To
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawPanel;
