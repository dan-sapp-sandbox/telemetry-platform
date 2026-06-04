import { useSelector, useDispatch } from "react-redux";
import { setDrawMode } from "@/store/slices/drawSlice";
import type { drawState, IDrawMode } from "@/store/slices/drawSlice";

interface IDrawPanelState {
  drawMode: IDrawMode | null;
  handleChangeDrawMode: (newDrawMode: IDrawMode) => void;
}

const useDrawTab = (): IDrawPanelState => {
  const dispatch = useDispatch();
  const { drawMode } = useSelector((state: { draw: drawState }) => state.draw);

  const handleChangeDrawMode = (newDrawMode: IDrawMode) => {
    if (drawMode === newDrawMode) {
      dispatch(setDrawMode(null));
    } else {
      dispatch(setDrawMode(newDrawMode));
    }
  };

  return {
    drawMode,
    handleChangeDrawMode,
  };
};

export default useDrawTab;
