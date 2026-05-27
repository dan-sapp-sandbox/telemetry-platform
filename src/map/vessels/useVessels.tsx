import { useEffect, useMemo, useRef, useState, type JSX, useContext } from "react";
import { useSelector } from "react-redux";
import VesselEntity from "./VesselEntity";
import { type PlaybackState } from "@/store/slices/playbackSlice";
import type { mapState } from "@/store/slices/mapSlice";
import { clock } from "@/map/simulationEngine";
import type { AISVessel } from "@/store/services/api";
import { CameraContext } from "@/map/types";
import { getBounds } from "@/map/utils";

export interface IVesselState {
  vesselEntities: JSX.Element[];
  showVessels: boolean;
}

// const AIS_WS_URL = "ws://127.0.0.1:8000/api/vessels/ws/ais";
const AIS_WS_URL = "https://sandbox-api-nifl.onrender.com/api/vessels/ws/ais";

const useVessels = (): IVesselState => {
  const socketRef = useRef<WebSocket | null>(null);

  const { selectedVessel } = useSelector((state: { vessels: any }) => state.vessels);
  const { dataLayer } = useSelector((state: { map: mapState }) => state.map);
  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const { mainViewerRef } = useContext(CameraContext);

  const [vessels, setVessels] = useState<AISVessel[]>([]);

  const showVessels = dataLayer === "vessels";

  useEffect(() => {
    if (isPlaying) clock.play();
    else clock.pause();

    clock.setSpeed(speed);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!showVessels) return;

    const socket = new WebSocket(AIS_WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("AIS websocket connected");

      const viewer = mainViewerRef.current;
      if (!viewer) return;

      const bounds = getBounds(viewer);
      if (bounds && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(bounds));
      }
    };

    socket.onmessage = async (event) => {
      try {
        let text: string;

        if (typeof event.data === "string") {
          text = event.data;
        } else if (event.data instanceof Blob) {
          text = await event.data.text();
        } else if (event.data instanceof ArrayBuffer) {
          text = new TextDecoder().decode(event.data);
        } else {
          return;
        }

        const data = JSON.parse(text);

        if (Array.isArray(data)) {
          setVessels(data);
        }
      } catch (err) {
        console.error("AIS parse error:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("AIS websocket error:", err);
    };

    socket.onclose = () => {
      console.log("AIS websocket closed");
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [showVessels, mainViewerRef]);

  useEffect(() => {
    if (!showVessels) return;
    if (!mainViewerRef.current) return;

    const viewer = mainViewerRef.current;
    const socket = socketRef.current;

    if (!socket) return;

    let timeout: number | null = null;

    const sendBounds = () => {
      const s = socketRef.current;
      if (!s || s.readyState !== WebSocket.OPEN) return;

      const bounds = getBounds(viewer);
      if (!bounds) return;

      s.send(JSON.stringify(bounds));
    };

    const debounced = () => {
      if (timeout) window.clearTimeout(timeout);

      timeout = window.setTimeout(() => {
        sendBounds();
      }, 150);
    };

    viewer.camera.moveEnd.addEventListener(debounced);
    viewer.camera.changed.addEventListener(debounced);

    return () => {
      viewer.camera.moveEnd.removeEventListener(debounced);
      viewer.camera.changed.removeEventListener(debounced);

      if (timeout) window.clearTimeout(timeout);
    };
  }, [showVessels, mainViewerRef]);

  const vesselEntities = useMemo(() => {
    return vessels.map((vessel) => {
      const isSelected = selectedVessel?.mmsi === vessel.mmsi;

      return <VesselEntity key={vessel.mmsi} vessel={vessel as any} isSelected={isSelected} />;
    });
  }, [vessels, selectedVessel]);

  return {
    vesselEntities,
    showVessels,
  };
};

export default useVessels;
