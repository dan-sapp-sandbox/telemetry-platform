import { useContext, useState, type Dispatch, type SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import { renameEntity, deleteEntity } from "@/store/slices/drawSlice";
import type { DrawEntity, drawState, Position } from "@/store/slices/drawSlice";
import { CameraContext } from "@/map/types";
import { BoundingSphere, Cartesian3, Cartographic } from "cesium";

interface IDrawDetails {
  handleRenameEntity: (entity: DrawEntity, newName: string) => void;
  handleDeleteEntity: (entity: DrawEntity) => void;
  entities: DrawEntity[];
  flyToDrawEntity: (entity: DrawEntity) => void;
  selectedEntity: DrawEntity | null;
  setSelectedEntity: Dispatch<SetStateAction<DrawEntity | null>>;
}
const deserializePosition = (position: Position) => new Cartesian3(position.x, position.y, position.z);

const useDrawDetails = (): IDrawDetails => {
  const dispatch = useDispatch();
  const [selectedEntity, setSelectedEntity] = useState<DrawEntity | null>(null);
  const { entities } = useSelector((state: { draw: drawState }) => state.draw);

  const { mainViewerRef } = useContext(CameraContext);
  const main = mainViewerRef.current;

  const flyToDrawEntity = (entity: DrawEntity) => {
    if (!main) return;
    const positions = entity.positions.map(deserializePosition);

    if (positions.length === 0) return;

    const currentHeight = main.camera.positionCartographic.height;

    if (positions.length === 1) {
      const cartographic = Cartographic.fromCartesian(positions[0]);

      const destination = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, currentHeight);

      main.camera.flyTo({
        destination,
        duration: 1.5,
      });

      return;
    }
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

  const handleRenameEntity = (entity: DrawEntity, newName: string) => {
    if (selectedEntity) {
      dispatch(renameEntity({ id: entity.id, newName }));
      setSelectedEntity({ ...selectedEntity, name: newName });
    }
  };
  const handleDeleteEntity = (entity: DrawEntity) => {
    dispatch(deleteEntity({ id: entity.id }));
    setSelectedEntity(null);
  };

  return {
    handleRenameEntity,
    handleDeleteEntity,
    flyToDrawEntity,
    entities,
    selectedEntity,
    setSelectedEntity,
  };
};

export default useDrawDetails;
