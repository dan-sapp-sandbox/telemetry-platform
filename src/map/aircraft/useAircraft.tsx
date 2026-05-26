import { useState, useContext, useEffect, useMemo, useRef, type JSX } from "react";

import { useSelector } from "react-redux";

import AircraftEntity from "./AircraftEntity";

import { CameraContext } from "@/map/types";
import { type mapState } from "@/store/slices/mapSlice";
import { type aircraftState } from "@/store/slices/aircraftSlice";
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
  // const [, forceRender] = useState(0);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const { selectedAircraft } = useSelector((state: { aircraft: aircraftState }) => state.aircraft);

  const { dataLayer } = useSelector((state: { map: mapState }) => state.map);

  const showAircraft = dataLayer === "aircraft";

  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const { mainViewerRef } = useContext(CameraContext);

  // useEffect(() => {
  //   if (!showAircraft) return;

  //   let frame: number;

  //   const tick = () => {
  //     forceRender((x) => x + 1);
  //     frame = requestAnimationFrame(tick);
  //   };

  //   frame = requestAnimationFrame(tick);

  //   return () => cancelAnimationFrame(frame);
  // }, [showAircraft]);

  useEffect(() => {
    if (isPlaying) clock.play();
    else clock.pause();

    clock.setSpeed(speed);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!showAircraft) {
      setAircraft([]);
    }
  }, [showAircraft]);

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
        const data = JSON.parse(event.data);
        setAircraft(data);
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("Aircraft websocket error:", err);
    };

    socket.onclose = () => {
      console.log("Aircraft websocket closed");
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [showAircraft, mainViewerRef]);

  useEffect(() => {
    if (!showAircraft) return;
    if (!mainViewerRef.current) return;

    const viewer = mainViewerRef.current;
    const socket = socketRef.current;

    if (!socket) return;

    let timeout: number | null = null;

    const sendBounds = () => {
      if (socket.readyState !== WebSocket.OPEN) return;

      const bounds = getBounds(viewer);
      if (!bounds) return;

      socket.send(JSON.stringify(bounds));
    };

    const debouncedSend = () => {
      if (timeout) window.clearTimeout(timeout);

      timeout = window.setTimeout(() => {
        sendBounds();
      }, 120);
    };

    viewer.camera.moveEnd.addEventListener(debouncedSend);
    viewer.camera.changed.addEventListener(debouncedSend);

    return () => {
      viewer.camera.moveEnd.removeEventListener(debouncedSend);
      viewer.camera.changed.removeEventListener(debouncedSend);

      if (timeout) window.clearTimeout(timeout);
    };
  }, [showAircraft, mainViewerRef]);

  const aircraftEntities = useMemo(() => {
    return aircraft.map((a) => {
      const isSelected = selectedAircraft?.icao === a.icao;

      return <AircraftEntity key={a.icao} aircraft={a} isSelected={isSelected} />;
    });
  }, [aircraft, selectedAircraft]);

  return {
    aircraftEntities,
    showAircraft,
  };
};

export default useAircraft;
