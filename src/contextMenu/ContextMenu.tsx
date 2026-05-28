import { Separator } from "@/components/ui/separator";
import useContextMenu from "./useContextMenu";
import { Button } from "@/components/ui/button";

const ContextMenu = () => {
  const { contextMenu, hideContextMenu, menuRef, addMarker, takeScreenshot } = useContextMenu();

  if (!contextMenu) return null;
  return (
    <div
      ref={menuRef}
      className="bg-(--background) text-(--text) absolute z-10000 flex flex-col gap-1 p-2 rounded"
      style={{
        left: contextMenu.x,
        top: contextMenu.y,
      }}
    >
      <Button variant="ghost" onClick={addMarker}>
        Add Marker
      </Button>
      <Separator />
      <Button variant="ghost" onClick={() => takeScreenshot(true)}>
        Download Screenshot
      </Button>
      <Separator />
      <Button variant="ghost" onClick={hideContextMenu}>
        Cancel
      </Button>
    </div>
  );
};

export default ContextMenu;
