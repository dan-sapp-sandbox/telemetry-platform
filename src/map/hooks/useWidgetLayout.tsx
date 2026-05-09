import { useRef, type RefObject } from "react";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import type { IWidgetState } from "../types";
import type { mapState } from "@/store/slices/mapSlice";
import useLocalStorage from "use-local-storage";
import { useSelector } from "react-redux";

export interface IWidgetLayout {
  containerRef: RefObject<HTMLDivElement | null>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  showOverviewMap: boolean;
  showPipMap: boolean;
  showPipMap2: boolean;
  widgetState: IWidgetState;
}

const useWidgetLayout = (): IWidgetLayout => {
  const { showOverviewMap, showPipMap, showPipMap2 } = useSelector((state: { map: mapState }) => state.map);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });

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

  return {
    containerRef,
    handleDragStart,
    handleDragEnd,
    showOverviewMap,
    showPipMap,
    showPipMap2,
    widgetState,
  };
};

export default useWidgetLayout;
