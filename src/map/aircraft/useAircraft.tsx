import { useState, useContext, useEffect, useMemo, useRef, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import AircraftEntity from "./AircraftEntity";
import { CameraContext, type ProcessedRoute } from "@/map/types";
import { processRoute } from "@/map/utils";
import { useGetAirRoutesQuery, useGetAircraftQuery } from "@/store/services/api";
import { setAircraft, type aircraftState } from "@/store/slices/aircraftSlice";
import { type PlaybackState } from "@/store/slices/playbackSlice";
import { clock } from "@/map/simulationEngine";

export interface IAircraftState {
  aircraftEntities: JSX.Element[];
  showAircraft: boolean;
}

const useAircraft = (): IAircraftState => {
  const dispatch = useDispatch();

  const [, forceRender] = useState(0);

  const { showAircraft, showAircraftNames, selectedAircraft } = useSelector(
    (state: { aircraft: aircraftState }) => state.aircraft,
  );

  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const { mainViewerRef } = useContext(CameraContext);

  const { data: routedAircraft = [] } = useGetAircraftQuery(undefined, {
    skip: !mainViewerRef.current,
  });

  const { data: routes = [] } = useGetAirRoutesQuery(undefined, {
    skip: !mainViewerRef.current,
  });

  useEffect(() => {
    let frame: number;

    const tick = () => {
      forceRender((x) => x + 1);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      clock.play();
    } else {
      clock.pause();
    }

    clock.setSpeed(speed);
  }, [isPlaying, speed]);

  const processedRoutes = useMemo(() => {
    return routes.reduce<Record<string, ProcessedRoute>>((acc, route) => {
      acc[route.id] = processRoute(route);
      return acc;
    }, {});
  }, [routes]);

  const previousIdsRef = useRef("");

  useEffect(() => {
    const ids = routedAircraft.map((v) => v.id).join(",");

    if (ids === previousIdsRef.current) return;

    previousIdsRef.current = ids;

    dispatch(
      setAircraft(
        routedAircraft.map((aircraft) => ({
          id: aircraft.id,
          name: aircraft.name,
          routeName: routes.find((r) => r.id === aircraft.routeId)?.name,
        })),
      ),
    );
  }, [dispatch, routedAircraft, routes]);

  const aircraftEntities = useMemo(() => {
    return routedAircraft.flatMap((aircraft) => {
      const route = processedRoutes[aircraft.routeId];
      if (!route) return [];

      const isSelected = selectedAircraft?.id === aircraft.id;

      return (
        <AircraftEntity
          key={aircraft.id}
          aircraft={{ ...aircraft, route }}
          showAircraftNames={showAircraftNames}
          isSelected={isSelected}
        />
      );
    });
  }, [routedAircraft, processedRoutes, showAircraftNames, selectedAircraft]);

  return {
    aircraftEntities,
    showAircraft,
  };
};

export default useAircraft;
