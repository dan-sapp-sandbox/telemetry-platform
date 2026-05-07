import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Cartesian3, Cartographic, Math, Viewer } from "cesium";
import type { IWidgetState } from "./types";
import type { ILayer, mapState } from "@/store/slices/mapSlice";
import useLocalStorage from "use-local-storage";
import { useSelector } from "react-redux";

export const defaultMainView = {
  heading: 6.283185307179581,
  height: 2000101.0682877784,
  lat: 29.927546494228835,
  lon: 54.599629924910886,
  pitch: -1.5682332501783933,
  roll: 0,
};
export const defaultPipView = {
  height: 7999.999999999899,
  lat: 29.240000000000006,
  lon: 50.314,
  heading: 6.283185307179581,
  pitch: -1.5684928999831915,
  roll: 0,
};
export const defaultPipView2 = {
  heading: 6.283185307179581,
  height: 11966.533380187617,
  lat: 35.69627462795138,
  lon: 51.38925863136245,
  pitch: -1.5684928999831915,
  roll: 0,
};

export interface IMapState {
  containerRef: RefObject<HTMLDivElement | null>;
  mainViewerRef: RefObject<Viewer | null>;
  overviewViewerRef: RefObject<Viewer | null>;
  pipViewerRef: RefObject<Viewer | null>;
  pipViewer2Ref: RefObject<Viewer | null>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  layer: ILayer;
  showOverviewMap: boolean;
  showPipMap: boolean;
  showPipMap2: boolean;
  widgetState: IWidgetState;
  takeScreenshot: () => void;
  sendPrompt: () => void;
}

const useMapState = (): IMapState => {
  const { showOverviewMap, showPipMap, showPipMap2, layer } = useSelector((state: { map: mapState }) => state.map);

  const tools = [
    {
      name: "createUser",
      description: "Create a user",
      parameters: {
        name: "string",
        email: "string",
      },
    },
  ];
  const sendPrompt = async () => {
    const res = await fetch("/api/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "Create a user named Dan with email dan@test.com",
        tools,
      }),
    });

    const data = await res.json();
    console.log(data);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mainViewerRef = useRef<Viewer | null>(null);
  const overviewViewerRef = useRef<Viewer | null>(null);
  const pipViewerRef = useRef<Viewer | null>(null);
  const pipViewer2Ref = useRef<Viewer | null>(null);
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });
  const [_init, setInitCameraView] = useLocalStorage("main-cam-init", defaultMainView);
  const initWidgetState: IWidgetState = {
    overview: {
      top: 65,
      left: 2,
      width: 20,
      aspect: 1,
    },
    pip: {
      left: 11.2,
      top: 22.5,
      width: 12,
      aspect: 3 / 4,
    },
    pip2: {
      left: 66.24074074074075,
      top: 16.48863636363636,
      width: 30,
      aspect: 4 / 3,
    },
  };
  type Position = {
    x: number;
    y: number;
  };
  const [widgetState, setWidgetState] = useLocalStorage<IWidgetState>("widget-state-v3", initWidgetState);
  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;

    switch (id) {
      case "overview":
        startPositionRef.current = {
          x: widgetState.overview.left,
          y: widgetState.overview.top,
        };
        break;
      case "pip":
        startPositionRef.current = {
          x: widgetState.pip.left,
          y: widgetState.pip.top,
        };
        break;
      case "pip-2":
        startPositionRef.current = {
          x: widgetState.pip2.left,
          y: widgetState.pip2.top,
        };
        break;
      default:
        console.log("missing id");
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    if (!containerRef.current) return;
    const { id } = event.active;
    const containerRect = containerRef.current.getBoundingClientRect();

    let xDiff = (100 * delta.x) / containerRect.width;
    let yDiff = (100 * delta.y) / containerRect.height;
    let newX = startPositionRef.current.x + xDiff;
    let newY = startPositionRef.current.y + yDiff;

    switch (id) {
      case "overview":
        setWidgetState({
          ...widgetState,
          overview: {
            ...widgetState.overview,
            left: newX,
            top: newY,
          },
        });
        break;
      case "pip":
        setWidgetState({
          ...widgetState,
          pip: {
            ...widgetState.pip,
            left: newX,
            top: newY,
          },
        });
        break;
      case "pip-2":
        setWidgetState({
          ...widgetState,
          pip2: {
            ...widgetState.pip2,
            left: newX,
            top: newY,
          },
        });
        break;
      default:
        console.log("missing id");
    }
  };

  const takeScreenshot = async () => {
    if (!containerRef.current) return;

    const viewers = [
      { ref: mainViewerRef, state: null }, // main viewer fills the canvas
      { ref: overviewViewerRef, state: widgetState.overview },
      { ref: pipViewerRef, state: widgetState.pip },
      { ref: pipViewer2Ref, state: widgetState.pip2 },
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
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "combined-maps.png";
    link.click();
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const tryAttach = () => {
      const main = mainViewerRef.current;
      const overview = overviewViewerRef.current;

      if (!main || !overview) {
        requestAnimationFrame(tryAttach);
        return;
      }

      const sync = () => {
        const main = mainViewerRef.current;
        const overview = overviewViewerRef.current;
        if (!main || !overview) return;

        const mainCam = main.camera;

        const carto = Cartographic.fromCartesian(mainCam.position);
        const boostedHeight = carto.height * 3 < 4500000 ? carto.height * 3 : 3800000;

        const boostedPosition = Cartesian3.fromRadians(carto.longitude, carto.latitude, boostedHeight);

        setInitCameraView({
          lon: Math.toDegrees(carto.longitude),
          lat: Math.toDegrees(carto.latitude),
          height: carto.height,
          heading: mainCam.heading,
          pitch: mainCam.pitch,
          roll: mainCam.roll,
        });
        overview.camera.setView({
          destination: boostedPosition,
          orientation: {
            heading: 0,
            pitch: -Math.PI / 2,
            roll: 0,
          },
        });
      };

      main.camera.changed.addEventListener(sync);
      sync();

      cleanup = () => {
        main.camera.changed.removeEventListener(sync);
      };
    };

    tryAttach();

    return () => {
      cleanup?.();
    };
  }, []);

  return {
    mainViewerRef,
    overviewViewerRef,
    pipViewerRef,
    pipViewer2Ref,
    handleDragStart,
    handleDragEnd,
    layer,
    showOverviewMap,
    showPipMap,
    showPipMap2,
    widgetState,
    containerRef,
    takeScreenshot,
    sendPrompt,
  };
};

export default useMapState;
