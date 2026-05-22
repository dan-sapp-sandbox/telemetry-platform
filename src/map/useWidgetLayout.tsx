import { useRef, type RefObject } from "react";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import type { mapState } from "@/store/slices/mapSlice";
import { updateWidgetState, type WidgetLayout, type IWidgetState } from "@/store/slices/widgetSlice";
import { useDispatch, useSelector } from "react-redux";

export interface IWidgetLayout {
  containerRef: RefObject<HTMLDivElement | null>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  showOverviewMap: boolean;
  showPipMap: boolean;
  showPipMap2: boolean;
  widgetLayout: WidgetLayout;
}

const useWidgetLayout = (): IWidgetLayout => {
  const dispatch = useDispatch();
  const { showOverviewMap, showPipMap, showPipMap2 } = useSelector((state: { map: mapState }) => state.map);
  const { widgetLayout } = useSelector((state: { widget: IWidgetState }) => state.widget);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });

  const handleUpdateWidgetState = (newWidgetState: WidgetLayout) => {
    dispatch(updateWidgetState(newWidgetState));
  };

  type Position = {
    x: number;
    y: number;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;

    switch (id) {
      case "overview":
        startPositionRef.current = {
          x: widgetLayout.overview.left,
          y: widgetLayout.overview.top,
        };
        break;
      case "pip":
        startPositionRef.current = {
          x: widgetLayout.pip.left,
          y: widgetLayout.pip.top,
        };
        break;
      case "pip-2":
        startPositionRef.current = {
          x: widgetLayout.pip2.left,
          y: widgetLayout.pip2.top,
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
        handleUpdateWidgetState({
          ...widgetLayout,
          overview: {
            ...widgetLayout.overview,
            left: newX,
            top: newY,
          },
        });
        break;
      case "pip":
        handleUpdateWidgetState({
          ...widgetLayout,
          pip: {
            ...widgetLayout.pip,
            left: newX,
            top: newY,
          },
        });
        break;
      case "pip-2":
        handleUpdateWidgetState({
          ...widgetLayout,
          pip2: {
            ...widgetLayout.pip2,
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
    widgetLayout,
  };
};

export default useWidgetLayout;
