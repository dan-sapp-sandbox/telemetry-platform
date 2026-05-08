import { useSelector, useDispatch } from "react-redux";
import { renameEntity, deleteEntity, setDrawMode } from "@/store/slices/drawSlice";
import type { DrawEntity, drawState, IDrawMode, Position } from "@/store/slices/drawSlice";
import { useContext } from "react";
import { CameraContext } from "@/map/types";
import { BoundingSphere, Cartesian3, Cartographic } from "cesium";

interface IDrawPanelState {
  drawMode: IDrawMode | null;
  handleChangeDrawMode: (newDrawMode: IDrawMode) => void;
  handleRenameEntity: (id: string, newName: string) => void;
  handleDeleteEntity: (id: string) => void;
  entities: DrawEntity[];
  flyToDrawEntity: (entity: DrawEntity) => void;
}
const deserializePosition = (position: Position) => new Cartesian3(position.x, position.y, position.z);

const useDrawPanel = (): IDrawPanelState => {
  const dispatch = useDispatch();
  const { drawMode, entities } = useSelector((state: { draw: drawState }) => state.draw);

  const { mainViewerRef } = useContext(CameraContext);
  const main = mainViewerRef.current;

  const flyToDrawEntity = (entity: DrawEntity) => {
    if (!main) return;
    const positions = entity.positions.map(deserializePosition);

    if (positions.length === 0) return;

    const currentHeight = main.camera.positionCartographic.height;

    // SINGLE POINT
    if (positions.length === 1) {
      const cartographic = Cartographic.fromCartesian(positions[0]);

      const destination = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, currentHeight);

      main.camera.flyTo({
        destination,
        duration: 1.5,
      });

      return;
    }

    // LINE / POLYGON
    const boundingSphere = BoundingSphere.fromPoints(positions);

    main.camera.flyToBoundingSphere(boundingSphere, {
      duration: 1.5,
      offset: {
        heading: main.camera.heading,
        pitch: main.camera.pitch,
        range: currentHeight,
      },
    });
  };

  const handleChangeDrawMode = (newDrawMode: IDrawMode) => {
    dispatch(setDrawMode(newDrawMode));
  };
  const handleRenameEntity = (id: string, newName: string) => {
    dispatch(renameEntity({ id, newName }));
  };
  const handleDeleteEntity = (id: string) => {
    dispatch(deleteEntity({ id }));
  };

  return {
    drawMode,
    handleChangeDrawMode,
    handleRenameEntity,
    handleDeleteEntity,
    flyToDrawEntity,
    entities,
  };
};

export default useDrawPanel;
