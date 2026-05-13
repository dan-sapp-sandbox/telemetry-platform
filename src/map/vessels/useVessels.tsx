import { useState, useContext, useEffect, type JSX } from "react";
import type { Vessel, vesselState } from "@/store/slices/vesselSlice";
import { useSelector } from "react-redux";
import VesselEntity from "./VesselEntity";
import { useGetVesselsQuery, type VesselBounds } from "@/store/services/api";
import { CameraContext } from "../types";
import { Math as CesiumMath, Viewer } from "cesium";

export interface IVesselState {
  VesselEntities: () => JSX.Element[];
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
  const [bounds, setBounds] = useState<VesselBounds | null>(null);
  const { mainViewerRef } = useContext(CameraContext);
  const {
    data,
    // isLoading,
    // error,
  } = useGetVesselsQuery(bounds!, {
    skip: !bounds,
  });
  console.log("data", data);
  const vessels: Vessel[] = [];
  const viewer = mainViewerRef?.current;

  useEffect(() => {
    if (!viewer) return;

    const updateBounds = () => {
      const nextBounds = getBounds(viewer);

      if (nextBounds) {
        setBounds(nextBounds);
      }
    };

    // initial load
    updateBounds();

    viewer.camera.moveEnd.addEventListener(updateBounds);

    return () => {
      viewer.camera.moveEnd.removeEventListener(updateBounds);
    };
  }, [viewer]);

  const { showVessels } = useSelector((state: { vessels: vesselState }) => state.vessels);

  const VesselEntities = (): JSX.Element[] => {
    return [];
    if (!showVessels) return [];
    return vessels.map((vessel) => <VesselEntity key={vessel.id} vessel={vessel} />);
  };

  return {
    VesselEntities,
  };
};

export default useVessels;
