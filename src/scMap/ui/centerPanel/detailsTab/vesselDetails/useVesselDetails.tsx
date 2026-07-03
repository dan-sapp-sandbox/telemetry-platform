import { useDispatch, useSelector } from "react-redux";
import { useContext, useState, useEffect } from "react";
import { type vesselState, setSelectedVessel } from "@/store/slices/vesselSlice";
import { setTrackedEntityId, type mapState } from "@/store/slices/mapSlice";
import type { AISVessel } from "@/store/services/api";
import { CameraContext } from "@/scMap/types";

export interface IVesselDetails {
  vessels: AISVessel[];
  selectedVessel: AISVessel | null;
  handleSetSelectedVessel: (vessel: AISVessel | null) => void;
  trackSelectedVessel: () => void;
  untrackSelectedVessel: () => void;
  trackedEntityId: string | null;
  showVesselsByZoom: boolean;
}

const useVesselDetails = (): IVesselDetails => {
  const dispatch = useDispatch();
  const { trackedEntityId } = useSelector((state: { map: mapState }) => state.map);
  const { vessels = [], selectedVessel } = useSelector((state: { vessels: vesselState }) => state.vessels);

  const { mainViewerRef } = useContext(CameraContext);

  const [showVesselsByZoom, setShowVesselsByZoom] = useState(false);

  useEffect(() => {
    const viewer = mainViewerRef.current;
    if (!viewer) return;

    const update = () => {
      const height = viewer.camera.positionCartographic.height;

      // meters above ellipsoid
      setShowVesselsByZoom(height < 100_000);
    };

    update();

    viewer.camera.changed.addEventListener(update);

    return () => {
      viewer.camera.changed.removeEventListener(update);
    };
  }, [mainViewerRef]);

  const handleSetSelectedVessel = (vessel: AISVessel | null) => {
    dispatch(setSelectedVessel(vessel));
  };

  const trackSelectedVessel = () => {
    if (selectedVessel) {
      dispatch(setTrackedEntityId(selectedVessel.mmsi));
    }
  };

  const untrackSelectedVessel = () => {
    dispatch(setTrackedEntityId(null));
  };

  return {
    vessels,
    handleSetSelectedVessel,
    trackSelectedVessel,
    untrackSelectedVessel,
    selectedVessel,
    trackedEntityId,
    showVesselsByZoom,
  };
};

export default useVesselDetails;
