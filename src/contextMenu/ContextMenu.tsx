import useContextMenu from "./useContextMenu";

const ContextMenu = () => {
  const { contextMenu, hideContextMenu, menuRef } = useContextMenu();

  if (!contextMenu) return null;
  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        left: contextMenu.x,
        top: contextMenu.y,
        zIndex: 10000,

        background: "#1e1e1e",
        border: "1px solid #444",
        borderRadius: 6,

        padding: 8,

        display: "flex",
        flexDirection: "column",
        gap: 4,

        minWidth: 180,
      }}
    >
      <button
      // onClick={() => {
      //   handleAddEntitity({
      //     id: crypto.randomUUID(),
      //     name: "Marker",
      //     type: "point",
      //     positions: [serializePosition(contextMenu.worldPosition)],
      //   });

      //   setContextMenu(null);
      // }}
      >
        Add Marker
      </button>

      <button onClick={hideContextMenu}>Cancel</button>
    </div>
  );
};

export default ContextMenu;
