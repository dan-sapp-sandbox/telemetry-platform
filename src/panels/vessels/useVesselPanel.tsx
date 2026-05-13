import { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type vesselState, type Vessel, setShowVessels, setShowVesselPaths } from "@/store/slices/vesselSlice";
import { CameraContext } from "@/map/types";
import { Cartographic, Cartesian3, Math as CesiumMath, Viewer } from "cesium";
import { useGetVesselsQuery, type VesselBounds } from "@/store/services/api";

export interface IVesselPanel {
  vessels: Vessel[];
  flyToVessel: (vessel: Vessel) => void;
  showVessels: boolean;
  handleToggleShowVessels: () => void;
  showVesselPaths: boolean;
  handleToggleShowVesselPaths: () => void;
}

export const getBounds = (viewer: Viewer): VesselBounds | null => {
  const rect = viewer.camera.computeViewRectangle();

  if (!rect) return null;

  return {
    west: CesiumMath.toDegrees(rect.west),
    south: CesiumMath.toDegrees(rect.south),
    east: CesiumMath.toDegrees(rect.east),
    north: CesiumMath.toDegrees(rect.north),
  };
};

const useVesselPanel = (): IVesselPanel => {
  const [bounds, setBounds] = useState<VesselBounds | null>(null);
  const { mainViewerRef } = useContext(CameraContext);
  const dispatch = useDispatch();
  const main = mainViewerRef.current;
  const {
    data: vessels = [],
    // isLoading,
    // error,
  } = useGetVesselsQuery(bounds!, {
    skip: !bounds,
  });
  const { showVessels, showVesselPaths } = useSelector((state: { vessels: vesselState }) => state.vessels);

  useEffect(() => {
    if (!main) return;

    const updateBounds = () => {
      const nextBounds = getBounds(main);

      if (nextBounds) {
        setBounds(nextBounds);
      }
    };

    updateBounds();

    main.camera.moveEnd.addEventListener(updateBounds);

    return () => {
      main.camera.moveEnd.removeEventListener(updateBounds);
    };
  }, [main]);

  const handleToggleShowVessels = () => {
    dispatch(setShowVessels(!showVessels));
  };
  const handleToggleShowVesselPaths = () => {
    dispatch(setShowVesselPaths(!showVesselPaths));
  };

  const flyToVessel = (vessel: Vessel) => {
    if (!main) return;

    const { lat, lon } = vessel;

    const currentHeight = main.camera.positionCartographic.height;

    const cartographic = Cartographic.fromDegrees(lon, lat, 0);

    const destination = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, currentHeight);

    main.camera.flyTo({
      destination,
      duration: 1.5,
    });

    return;
  };

  return {
    vessels,
    flyToVessel,
    showVessels,
    handleToggleShowVessels,
    showVesselPaths,
    handleToggleShowVesselPaths,
  };
};

export default useVesselPanel;
