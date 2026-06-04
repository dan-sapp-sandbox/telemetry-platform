import { Locate, Trash2, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import useDrawDetails from "./useDrawDetails";
import { useState, useEffect } from "react";

const DrawDetails = () => {
  const { handleEditEntity, handleDeleteEntity, flyToDrawEntity, entities, selectedEntity, handleSetSelectedEntity } =
    useDrawDetails();
  const [name, setName] = useState(selectedEntity?.name ?? "");

  useEffect(() => {
    setName(selectedEntity?.name ?? "");
  }, [selectedEntity?.id]);

  return (
    <div className="flex h-full flex-1">
      <div className="flex flex-col w-1/3 overflow-y-auto scrollbar-hide">
        {!entities.length && <div className="text-(--text)/80 p-4 text-sm">None</div>}
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
              onClick={() => handleSetSelectedEntity(entity)}
            >
              {entity.name || entity.type}
            </div>
          );
        })}
      </div>
      <Separator orientation="vertical" />
      {selectedEntity ? (
        <div className="flex flex-col flex-1 p-2 xl:p-4 text-(--text)/80 overflow-y-auto">
          <div className="flex justify-between">
            <div className="text-base lg:text-lg font-bold capitalize">Selected {selectedEntity.type}</div>
            <X className="size-4 md:size-6" onClick={() => handleSetSelectedEntity(null)} />
          </div>
          <div className="bg-slate-800/50 p-1 flex items-center gap-2">
            {/* <input
              className="flex-1 rounded-lg bg-zinc-800/60 border border-white/10 outline-none text-xl md:text-sm text-(--text)/80"
              placeholder="Name"
              value={selectedEntity.name}
              onBlur={(e) => handleEditEntity({ ...selectedEntity, name: e.target.value })}
            /> */}
            <input
              className="flex-1 rounded-lg bg-zinc-800/60 border border-white/10 outline-none text-xl md:text-sm text-(--text)/80"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() =>
                handleEditEntity({
                  ...selectedEntity,
                  name,
                })
              }
            />
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer p-1 bg-slate-800/50 hover-bg-blue-800/50 hover:text-blue-300/80"
            onClick={() => flyToDrawEntity(selectedEntity)}
          >
            <Locate className="size-4" />
            <div className="">Center Map on Entity</div>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer p-1 bg-slate-800/50 hover-bg-blue-800/50 hover:text-blue-300/80"
            onClick={() => handleDeleteEntity(selectedEntity)}
          >
            <Trash2 className="size-4" />
            <div className="">Delete Entity</div>
          </div>
        </div>
      ) : (
        <div className="flex-col flex-1 p-4 gap-4 text-(--text)/80">
          <div className="text-sm">No Selection</div>
        </div>
      )}
    </div>
  );
};

export default DrawDetails;
