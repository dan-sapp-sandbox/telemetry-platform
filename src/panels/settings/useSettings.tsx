import { useSelector, useDispatch } from "react-redux";
import { setShowOverviewMap, setShowPipMap, setShowPipMap2, setLayer, resetToDefault } from "@/store/slices/mapSlice";
import type { ILayer, mapState } from "@/store/slices/mapSlice";

export interface ISettingsState {
  handleToggleOverviewMap: () => void;
  showOverviewMap: boolean;
  handleTogglePipMap: () => void;
  showPipMap: boolean;
  handleTogglePipMap2: () => void;
  showPipMap2: boolean;
  handleChangeLayer: (newLayer: ILayer) => void;
  layer: ILayer;
  handleResetToDefault: () => void;
}

const useSettings = (): ISettingsState => {
  const dispatch = useDispatch();

  const { showOverviewMap, showPipMap, showPipMap2, layer } = useSelector((state: { map: mapState }) => state.map);

  const handleToggleOverviewMap = () => {
    dispatch(setShowOverviewMap(!showOverviewMap));
  };
  const handleTogglePipMap = () => {
    dispatch(setShowPipMap(!showPipMap));
  };
  const handleTogglePipMap2 = () => {
    dispatch(setShowPipMap2(!showPipMap2));
  };
  const handleChangeLayer = (newLayer: ILayer) => {
    dispatch(setLayer(newLayer));
  };
  const handleResetToDefault = () => {
    dispatch(resetToDefault());
  };

  return {
    handleToggleOverviewMap,
    showOverviewMap,
    handleTogglePipMap,
    showPipMap,
    handleTogglePipMap2,
    showPipMap2,
    handleChangeLayer,
    layer,
    handleResetToDefault,
  };
};

export default useSettings;
