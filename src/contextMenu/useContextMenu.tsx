import { useState, useEffect, useRef, useContext, type RefObject } from "react";
import { useCesium } from "resium";
import { useSelector, useDispatch } from "react-redux";
import { addEntity, type drawState, type DrawEntity } from "@/store/slices/drawSlice";
import { Cartesian2, Cartesian3, ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";
import { CameraContext } from "@/map/types";
import type { IWidgetState } from "@/store/slices/widgetSlice";
import { addSectionToReport } from "@/store/slices/reportSlice";

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
  takeScreenshot: (isDownload?: boolean) => void;
  menuRef: RefObject<HTMLDivElement | null>;
}

const useContextMenu = (): IContextMenu => {
  const dispatch = useDispatch();
  const { drawMode } = useSelector((state: { draw: drawState }) => state.draw);
  const { widgetLayout } = useSelector((state: { widget: IWidgetState }) => state.widget);
  const { containerRef, mainViewerRef, overviewViewerRef, pipViewerRef, pipViewer2Ref } = useContext(CameraContext);
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

  const hideContextMenu = () => {
    setContextMenu(null);
  };

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
      type: "point",
      positions: [serializePosition(contextMenu.worldPosition)],
      icon: lucideToDataUrl(<MapPin size={32} color="#ffffff" fill="#000000" strokeWidth={2} />),
    });
    hideContextMenu();
  };

  const takeScreenshot = async (isDownload?: boolean) => {
    if (!containerRef.current) return;

    const viewers = [
      { ref: mainViewerRef, state: null },
      { ref: overviewViewerRef, state: widgetLayout.overview },
      { ref: pipViewerRef, state: widgetLayout.pip },
      { ref: pipViewer2Ref, state: widgetLayout.pip2 },
    ];

    // Wait for all viewers to render
    for (const viewerObj of viewers) {
      const viewer = viewerObj.ref.current;
      if (!viewer) continue;
      await new Promise<void>((resolve) => {
        viewer.scene.render();
        requestAnimationFrame(() => resolve());
      });
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = containerRect.width;
    combinedCanvas.height = containerRect.height;
    const ctx = combinedCanvas.getContext("2d");
    if (!ctx) return;

    viewers.forEach((viewerObj, i) => {
      const viewer = viewerObj.ref.current;
      if (!viewer) return;
      const canvas = viewer.scene.canvas;

      if (viewerObj.state) {
        const { top, left, width, aspect } = viewerObj.state;
        const pxLeft = (left / 100) * containerRect.width;
        const pxTop = (top / 100) * containerRect.height;
        const pxWidth = (width / 100) * containerRect.width;
        const pxHeight = pxWidth / aspect;

        ctx.drawImage(canvas, pxLeft, pxTop, pxWidth, pxHeight);

        ctx.lineWidth = 1;
        ctx.strokeStyle = i === 1 ? "white" : i === 2 ? "#8b008b" : "#0000ff";
        ctx.strokeRect(pxLeft, pxTop, pxWidth, pxHeight);
      } else {
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
      }
    });

    // Export combined screenshot
    const dataUrl = combinedCanvas.toDataURL("image/png");

    if (isDownload) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "combined-maps.png";
      link.click();
    } else {
      dispatch(
        addSectionToReport({
          id: crypto.randomUUID(),
          type: "image",
          imageUrl: dataUrl,
        }),
      );
    }
    hideContextMenu();
  };

  return {
    contextMenu,
    hideContextMenu,
    menuRef,
    addMarker,
    takeScreenshot,
  };
};

export default useContextMenu;
