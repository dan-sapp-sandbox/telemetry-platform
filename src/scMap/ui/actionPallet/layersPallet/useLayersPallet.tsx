import { useSelector, useDispatch } from "react-redux";
import { setLayer, type ILayer, type mapState } from "@/store/slices/mapSlice";

export interface IVesselPallet {
  layer: ILayer;
  handleChangeLayer: (newLayer: ILayer) => void;
}

const useLayersPallet = (): IVesselPallet => {
  const dispatch = useDispatch();
  const { layer } = useSelector((state: { map: mapState }) => state.map);

  const handleChangeLayer = (newLayer: ILayer) => {
    dispatch(setLayer(newLayer));
  };

  return {
    handleChangeLayer,
    layer,
  };
};

export default useLayersPallet;
