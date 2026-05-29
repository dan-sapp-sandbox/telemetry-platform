import { useContext, useEffect, useMemo, useRef, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";

import AircraftEntity from "./AircraftEntity";
import { CameraContext } from "@/map/types";

import { type mapState } from "@/store/slices/mapSlice";
import { setAircraftMap, type AircraftState } from "@/store/slices/aircraftSlice";
import { type PlaybackState } from "@/store/slices/playbackSlice";

import { clock } from "@/map/simulationEngine";
import { getBounds } from "@/map/utils";
import type { Aircraft } from "@/store/services/api";

export interface IAircraftState {
  aircraftEntities: JSX.Element[];
  showAircraft: boolean;
}

// const WS_URL = "ws://localhost:8000/api/aircraft/ws/aircraft";
const WS_URL = "https://sandbox-api-nifl.onrender.com/api/aircraft/ws/aircraft";

const useAircraft = (): IAircraftState => {
  const dispatch = useDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const clockStartedRef = useRef(false);

  const { selectedAircraft, aircraftMap } = useSelector((state: { aircraft: AircraftState }) => state.aircraft);

  const { dataLayer } = useSelector((state: { map: mapState }) => state.map);

  const showAircraft = dataLayer === "aircraft";

  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const { mainViewerRef } = useContext(CameraContext);

  useEffect(() => {
    if (isPlaying) clock.play();
    else clock.pause();

    clock.setSpeed(speed);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!showAircraft) return;

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Aircraft websocket connected");

      const trySendInitialBounds = () => {
        const viewer = mainViewerRef.current;

        if (!viewer) {
          requestAnimationFrame(trySendInitialBounds);
          return;
        }

        const bounds = getBounds(viewer);

        if (socket.readyState === WebSocket.OPEN && bounds) {
          socket.send(JSON.stringify(bounds));
        }
      };

      trySendInitialBounds();
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type !== "append") return;

        const incoming: Aircraft[] = msg.aircraft;

        if (incoming.length > 0 && !clockStartedRef.current) {
          clock.setTime(incoming[0].snapshot_time);
          clock.start();
          clockStartedRef.current = true;
        }

        const updated = (() => {
          const next = { ...(aircraftMap || {}) };

          for (const a of incoming) {
            if (!next[a.icao]) {
              next[a.icao] = [];
            }

            next[a.icao].push(a);
          }

          return next;
        })();

        dispatch(setAircraftMap(updated));
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [showAircraft, mainViewerRef]);

  const aircraftEntities = useMemo(() => {
    return Object.entries(aircraftMap || {}).map(([icao, snapshots]) => {
      const latest = snapshots[snapshots.length - 1];
      const isSelected = selectedAircraft?.icao === icao;

      return <AircraftEntity key={icao} aircraft={latest} snapshots={snapshots} isSelected={isSelected} />;
    });
  }, [aircraftMap, selectedAircraft]);

  return {
    aircraftEntities,
    showAircraft,
  };
};

export default useAircraft;
