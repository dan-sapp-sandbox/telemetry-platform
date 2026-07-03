import { useDispatch, useSelector } from "react-redux";
import { useContext, useMemo, useState, useEffect } from "react";

import { type AircraftState, setSelectedAircraft } from "@/store/slices/aircraftSlice";
import { setTrackedEntityId, type mapState } from "@/store/slices/mapSlice";

import type { Aircraft } from "@/store/services/api";
import { getBounds } from "@/scMap/utils";
import { CameraContext } from "@/scMap/types";

function isInBounds(a: Aircraft, bounds: any): boolean {
  if (!bounds) return true;

  return a.lon >= bounds.west && a.lon <= bounds.east && a.lat >= bounds.south && a.lat <= bounds.north;
}

export interface IAircraftDetails {
  aircraft: Aircraft[];
  visibleAircraft: Aircraft[];
  selectedAircraft: Aircraft | null;
  handleSetSelectedAircraft: (aircraft: Aircraft | null) => void;
  trackSelectedAircraft: () => void;
  untrackSelectedAircraft: () => void;
  trackedEntityId: string | null;
  showAircraftByZoom: boolean;
}

const useAircraftDetails = (): IAircraftDetails => {
  const dispatch = useDispatch();

  const { mainViewerRef } = useContext(CameraContext);

  const [showAircraftByZoom, setShowAircraftByZoom] = useState(false);

  useEffect(() => {
    const viewer = mainViewerRef.current;
    if (!viewer) return;

    const update = () => {
      const height = viewer.camera.positionCartographic.height;

      // meters above ellipsoid
      setShowAircraftByZoom(height < 200_000);
    };

    update();

    viewer.camera.changed.addEventListener(update);

    return () => {
      viewer.camera.changed.removeEventListener(update);
    };
  }, [mainViewerRef]);

  const { trackedEntityId } = useSelector((state: { map: mapState }) => state.map);

  const { aircraft, selectedAircraft } = useSelector((state: { aircraft: AircraftState }) => state.aircraft);

  const bounds = getBounds(mainViewerRef.current);

  const visibleAircraft = useMemo(() => {
    return aircraft.filter((a) => isInBounds(a, bounds));
  }, [aircraft, bounds]);

  const handleSetSelectedAircraft = (aircraft: Aircraft | null) => {
    dispatch(setSelectedAircraft(aircraft));
  };

  const trackSelectedAircraft = () => {
    if (selectedAircraft) {
      dispatch(setTrackedEntityId(selectedAircraft.icao));
    }
  };

  const untrackSelectedAircraft = () => {
    dispatch(setTrackedEntityId(null));
  };

  return {
    aircraft,
    visibleAircraft,
    selectedAircraft,
    handleSetSelectedAircraft,
    trackedEntityId,
    trackSelectedAircraft,
    untrackSelectedAircraft,
    showAircraftByZoom,
  };
};

export default useAircraftDetails;
