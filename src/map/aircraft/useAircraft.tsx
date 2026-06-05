import { useContext, useEffect, useMemo, useRef, useState, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import AircraftEntity from "./AircraftEntity";
import { CameraContext } from "@/map/types";
import { type mapState } from "@/store/slices/mapSlice";
import { setGlobalAircraft, type AircraftState } from "@/store/slices/aircraftSlice";
import { type PlaybackState, clearTimeRange, setTimeRange, setEndTime } from "@/store/slices/playbackSlice";
import { clock } from "@/map/simulationEngine";
import { getBounds } from "@/map/utils";
import type { Aircraft } from "@/store/services/api";

export interface IAircraftState {
  aircraftEntities: JSX.Element[];
  showAircraft: boolean;
}

const WS_URL = "https://sandbox-api-nifl.onrender.com/api/aircraft/ws/aircraft";
// const WS_URL = "ws://localhost:8000/api/aircraft/ws/aircraft";

type AircraftTrajectoryMap = Record<string, Aircraft[]>;

const useAircraft = (): IAircraftState => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket | null>(null);

  const { selectedAircraft } = useSelector((state: { aircraft: AircraftState }) => state.aircraft);
  const { dataLayer } = useSelector((state: { map: mapState }) => state.map);
  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const { mainViewerRef } = useContext(CameraContext);

  const showAircraft = dataLayer === "aircraft";

  const [aircraftMap, setAircraftMap] = useState<AircraftTrajectoryMap>({});

  useEffect(() => {
    if (isPlaying) clock.play();
    else clock.pause();

    clock.setSpeed(speed);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!showAircraft) {
      setAircraftMap({});
      dispatch(setGlobalAircraft([]));
    }
  }, [showAircraft]);

  useEffect(() => {
    if (!showAircraft) return;

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[AIRCRAFT] connected");

      const sendBounds = () => {
        const viewer = mainViewerRef.current;
        if (!viewer) return;

        const bounds = getBounds(viewer);
        if (bounds && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(bounds));
        }
      };

      sendBounds();
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (!msg?.snapshots || typeof msg.snapshots !== "object") return;

        setAircraftMap((prev) => {
          const next: Record<string, Aircraft[]> = { ...prev };

          for (const [icao, newSnapshots] of Object.entries(msg.snapshots)) {
            const existing = next[icao] ?? [];

            const merged = existing.concat(newSnapshots as Aircraft[]);

            const deduped = new Map<number, Aircraft>();

            for (const s of merged) {
              const prev = deduped.get(s.snapshot_time);

              if (!prev || s.snapshot_time >= prev.snapshot_time) {
                deduped.set(s.snapshot_time, s);
              }
            }

            next[icao] = Array.from(deduped.values()).sort((a, b) => a.snapshot_time - b.snapshot_time);
          }

          return next;
        });

        const flat = Object.values(msg.snapshots)
          .map((trajectory: any) => {
            if (!trajectory.length) return null;
            return trajectory[trajectory.length - 1];
          })
          .filter(Boolean);

        dispatch(setGlobalAircraft(flat));

        if (msg.type === "init") {
          const currentTime = Date.now();
          const diff = (msg.end_time - msg.start_time) * 1000;
          dispatch(setTimeRange({ startTime: currentTime - diff, endTime: currentTime }));
        }
        if (msg.type === "append") {
          const diff = msg.end_time - msg.start_time;
          dispatch(setEndTime(diff * 1000));
        }
      } catch (err) {
        console.error("[AIRCRAFT parse error]", err);
      }
    };

    socket.onerror = (err) => {
      console.error("[AIRCRAFT websocket error]", err);
    };

    socket.onclose = () => {
      console.log("[AIRCRAFT websocket closed]");
      clock.setTime(0);
      dispatch(clearTimeRange());
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [showAircraft, mainViewerRef, dispatch]);

  const aircraftEntities = useMemo(() => {
    return Object.entries(aircraftMap)
      .map(([icao, snapshots]) => {
        const latest = snapshots[snapshots.length - 1];
        if (!latest) return null;

        const isSelected = selectedAircraft?.icao === icao;

        return <AircraftEntity key={icao} aircraft={latest} snapshots={snapshots} isSelected={isSelected} />;
      })
      .filter(Boolean) as JSX.Element[];
  }, [aircraftMap, selectedAircraft]);

  return {
    aircraftEntities,
    showAircraft,
  };
};

export default useAircraft;
