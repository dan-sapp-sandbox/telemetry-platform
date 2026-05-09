import { useState, useEffect, useRef, type RefObject } from "react";
import { useCesium } from "resium";
import { useSelector, useDispatch } from "react-redux";
import { addEntity, type drawState, type DrawEntity } from "@/store/slices/drawSlice";
import { Cartesian2, Cartesian3, ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";

const lucideToDataUrl = (icon: React.ReactElement) => {
  const svgString = renderToStaticMarkup(icon);

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
};

interface IContextMenu {
  contextMenu: {
    x: number;
    y: number;
    worldPosition: Cartesian3;
  } | null;
  addMarker: () => void;
  hideContextMenu: () => void;
  menuRef: RefObject<HTMLDivElement | null>;
}

const useContextMenu = (): IContextMenu => {
  const dispatch = useDispatch();
  const { drawMode } = useSelector((state: { draw: drawState }) => state.draw);
  const { viewer } = useCesium();

  const drawModeRef = useRef(drawMode);
  const contextMenuRef = useRef<{
    x: number;
    y: number;
    worldPosition: Cartesian3;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    worldPosition: Cartesian3;
  } | null>(null);

  useEffect(() => {
    drawModeRef.current = drawMode;
  }, [drawMode]);

  useEffect(() => {
    contextMenuRef.current = contextMenu;
  }, [contextMenu]);

  const getWorldPosition = (screenPosition: Cartesian2) => {
    if (!viewer) return null;

    const ray = viewer.camera.getPickRay(screenPosition);

    if (!ray) return null;

    return viewer.scene.globe.pick(ray, viewer.scene);
  };

  useEffect(() => {
    if (!viewer) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((click: any) => {
      if (drawModeRef.current) return;

      const position = getWorldPosition(click.position);

      if (!position) return;

      setContextMenu({
        x: click.position.x,
        y: click.position.y,
        worldPosition: position,
      });
    }, ScreenSpaceEventType.RIGHT_CLICK);

    handler.setInputAction(() => {
      //
      if (drawModeRef.current) return;

      if (contextMenuRef.current) {
        setContextMenu(null);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [viewer]);

  const handleAddEntitity = (newEntity: DrawEntity) => {
    dispatch(addEntity(newEntity));
  };

  const serializePosition = (position: Cartesian3) => ({
    x: position.x,
    y: position.y,
    z: position.z,
  });

  const addMarker = () => {
    if (!contextMenu) return;

    handleAddEntitity({
      id: crypto.randomUUID(),
      name: "Marker",
      type: "point",
      positions: [serializePosition(contextMenu.worldPosition)],
      icon: lucideToDataUrl(<MapPin size={32} color="#ffffff" fill="#000000" strokeWidth={2} />),
    });

    setContextMenu(null);
  };

  const hideContextMenu = () => {
    setContextMenu(null);
  };

  return {
    contextMenu,
    hideContextMenu,
    menuRef,
    addMarker,
  };
};

export default useContextMenu;
