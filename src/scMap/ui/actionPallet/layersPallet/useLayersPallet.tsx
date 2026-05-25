import { useSelector, useDispatch } from "react-redux";
import { setLayer, setDataLayer, type IDataLayer, type ILayer, type mapState } from "@/store/slices/mapSlice";

export interface ILayersPallet {
  layer: ILayer;
  handleChangeLayer: (newLayer: ILayer) => void;
  dataLayer: IDataLayer | null;
  handleChangeDataLayer: (newDataLayer: IDataLayer) => void;
}

const useLayersPallet = (): ILayersPallet => {
  const dispatch = useDispatch();
  const { layer, dataLayer } = useSelector((state: { map: mapState }) => state.map);

  const handleChangeLayer = (newLayer: ILayer) => {
    dispatch(setLayer(newLayer));
  };
  const handleChangeDataLayer = (newDataLayer: IDataLayer) => {
    dispatch(setDataLayer(dataLayer === newDataLayer ? null : newDataLayer));
  };

  return {
    handleChangeLayer,
    handleChangeDataLayer,
    layer,
    dataLayer,
  };
};

export default useLayersPallet;
