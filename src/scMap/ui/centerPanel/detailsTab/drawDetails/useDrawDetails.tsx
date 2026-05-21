import { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { renameEntity, deleteEntity, setSelectedEntity } from "@/store/slices/drawSlice";
import type { DrawEntity, drawState, Position } from "@/store/slices/drawSlice";
import { CameraContext } from "@/map/types";
import { BoundingSphere, Cartesian3, Cartographic } from "cesium";

interface IDrawDetails {
  handleRenameEntity: (entity: DrawEntity, newName: string) => void;
  handleDeleteEntity: (entity: DrawEntity) => void;
  entities: DrawEntity[];
  flyToDrawEntity: (entity: DrawEntity) => void;
  selectedEntity: DrawEntity | null;
  handleSetSelectedEntity: (entity: DrawEntity) => void;
}
const deserializePosition = (position: Position) => new Cartesian3(position.x, position.y, position.z);

const useDrawDetails = (): IDrawDetails => {
  const dispatch = useDispatch();
  const { entities, selectedEntity } = useSelector((state: { draw: drawState }) => state.draw);

  // const makeRoute = () => {
  //   if (!entities.length) return null;
  //   const positions = entities.map((p) => {
  //     return p.positions.map((pos) => {
  //       const deserialized = deserializePosition(pos);
  //       const cart = Cartesian3.fromElements(deserialized.x, deserialized.y, deserialized.z);
  //       const geo = Cartographic.fromCartesian(cart);

  //       return {
  //         lat: CesiumMath.toDegrees(geo.latitude),
  //         lon: CesiumMath.toDegrees(geo.longitude),
  //       };
  //     });
  //   });
  //   return positions;
  //   return `(
  //     'hormuz',
  //     'Kharg Island → Oman',
  //     ''::jsonb
  //   )`;
  // };
  // console.log("makeRoute", makeRoute());

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

  const handleSetSelectedEntity = (entity: DrawEntity) => {
    dispatch(setSelectedEntity(entity));
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
    handleSetSelectedEntity,
  };
};

export default useDrawDetails;
