import { useSelector, useDispatch } from "react-redux";
import { setDrawMode, type drawState, type IDrawMode } from "@/store/slices/drawSlice";

interface IDrawPanelState {
  drawMode: IDrawMode | null;
  handleChangeDrawMode: (newDrawMode: IDrawMode) => void;
}

const useDrawPanel = (): IDrawPanelState => {
  const dispatch = useDispatch();
  const { drawMode } = useSelector((state: { draw: drawState }) => state.draw);
  const handleChangeDrawMode = (newDrawMode: IDrawMode) => {
    dispatch(setDrawMode(newDrawMode));
  };

  return {
    drawMode,
    handleChangeDrawMode,
  };
};

export default useDrawPanel;
