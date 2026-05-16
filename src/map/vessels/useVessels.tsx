import { useState, useContext, useEffect, useMemo, type JSX } from "react";
import { setVessels, type vesselState } from "@/store/slices/vesselSlice";
import { useDispatch, useSelector } from "react-redux";
import VesselEntity from "./VesselEntity";
import { useGetVesselsQuery, type VesselBounds } from "@/store/services/api";
import { CameraContext } from "../types";
import { Math as CesiumMath, Viewer } from "cesium";

export interface IVesselState {
  vesselEntities: JSX.Element[];
  showVessels: boolean;
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

const useVessels = (): IVesselState => {
  const dispatch = useDispatch();
  const { showVessels, showVesselNames } = useSelector((state: { vessels: vesselState }) => state.vessels);
  const [bounds, setBounds] = useState<VesselBounds | null>(null);
  const { mainViewerRef } = useContext(CameraContext);
  const viewer = mainViewerRef?.current;
  const {
    data: vessels,
    // isLoading,
    // error,
  } = useGetVesselsQuery(bounds!, {
    skip: !bounds || !viewer,
  });

  useEffect(() => {
    dispatch(setVessels(vessels));
  }, [vessels]);

  useEffect(() => {
    if (!viewer) return;

    const updateBounds = () => {
      const nextBounds = getBounds(viewer);

      if (nextBounds) {
        setBounds(nextBounds);
      }
    };

    updateBounds();

    viewer.camera.moveEnd.addEventListener(updateBounds);

    return () => {
      viewer.camera.moveEnd.removeEventListener(updateBounds);
    };
  }, [viewer]);

  const vesselEntities = useMemo(() => {
    if (!vessels) return [];

    return vessels.map((vessel) => <VesselEntity key={vessel.id} vessel={vessel} showVesselNames={showVesselNames} />);
  }, [vessels, showVesselNames]);

  return {
    vesselEntities,
    showVessels,
  };
};

export default useVessels;
