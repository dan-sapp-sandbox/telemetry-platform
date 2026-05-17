import { Edit2, Locate, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useDrawDetails from "./useDrawDetails";

const DrawDetails = () => {
  const { handleRenameEntity, handleDeleteEntity, flyToDrawEntity, entities, selectedEntity, setSelectedEntity } =
    useDrawDetails();
  return (
    <div className="flex h-full">
      <div className="flex flex-col w-1/3 overflow-y-auto scrollbar-hide">
        {!entities.length && <div className="text-(--text)/80">None</div>}
        {entities.map((entity, index) => {
          const getBackgroundStyles = () => {
            if (index % 2 === 0) {
              if (selectedEntity?.id === entity.id) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-800/50";
            } else {
              if (selectedEntity?.id === entity.id) {
                return "bg-blue-400/20";
              }
              return "bg-zinc-700/50";
            }
          };
          return (
            <div
              key={entity.id}
              className={cn([
                "cursor-pointer px-2 py-0.5 transition-colors text-(--text)/80 hover:bg-blue-400/30",
                getBackgroundStyles(),
              ])}
              onClick={() => setSelectedEntity(entity)}
            >
              {entity.name || entity.type}
            </div>
          );
        })}
      </div>
      <Separator orientation="vertical" />
      {selectedEntity ? (
        <div className="flex flex-col flex-1 pl-2 text-(--text)/80 overflow-y-auto">
          <div className="bg-slate-800/50 py-0.5 flex items-center gap-2">
            Name: {selectedEntity.name || "none"}
            <Edit2 className="size-4" onClick={() => handleRenameEntity(selectedEntity, "new name")} />
          </div>
          <div className="bg-slate-700/50 py-0.5">Type: {selectedEntity.type}</div>
          <div
            className="flex items-center gap-2 cursor-pointer py-0.5 bg-slate-800/50 hover-bg-blue-800/50 hover:text-blue-300/80"
            onClick={() => flyToDrawEntity(selectedEntity)}
          >
            <Locate className="size-4" />
            <div className="">Center Map on Entity</div>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer py-0.5 bg-slate-800/50 hover-bg-blue-800/50 hover:text-blue-300/80"
            onClick={() => handleDeleteEntity(selectedEntity)}
          >
            <Trash2 className="size-4" />
            <div className="">Delete Entity</div>
          </div>
        </div>
      ) : (
        <div className="flex-col flex-1 pl-2 gap-2 text-(--text)/80">
          <div className="text-sm">No selection</div>
          <div className="p-3 rounded-lg bg-zinc-800/40 border border-white/10">Select a Entity to inspect</div>
        </div>
      )}
    </div>
  );
};

export default DrawDetails;
