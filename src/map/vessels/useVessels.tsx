import { useEffect, useMemo, useRef, useState, type JSX, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import VesselEntity from "./VesselEntity";
import { clearTimeRange, setEndTime, setTimeRange, type PlaybackState } from "@/store/slices/playbackSlice";
import type { mapState } from "@/store/slices/mapSlice";
import { clock } from "@/map/simulationEngine";
import type { AISVessel } from "@/store/services/api";
import { CameraContext } from "@/map/types";
import { getBounds } from "@/map/utils";
import { setGlobalVessels, type vesselState } from "@/store/slices/vesselSlice";

export interface IVesselState {
  vesselEntities: JSX.Element[];
  showVessels: boolean;
}

const AIS_WS_URL = "https://sandbox-api-nifl.onrender.com/api/vessels/ws/ais";
// const AIS_WS_URL = "ws://localhost:8000/api/vessels/ws/ais";

type VesselTrajectoryMap = Record<string, AISVessel[]>;

const useVessels = (): IVesselState => {
  const socketRef = useRef<WebSocket | null>(null);
  const dispatch = useDispatch();

  const { selectedVessel } = useSelector((state: { vessels: vesselState }) => state.vessels);
  const { dataLayer } = useSelector((state: { map: mapState }) => state.map);
  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const { mainViewerRef } = useContext(CameraContext);

  const showVessels = dataLayer === "vessels";

  const [vesselMap, setVesselMap] = useState<VesselTrajectoryMap>({});

  useEffect(() => {
    if (isPlaying) clock.play();
    else clock.pause();

    clock.setSpeed(speed);
  }, [isPlaying, speed]);

  useEffect(() => {
    if (!showVessels) {
      setVesselMap({});
      dispatch(setGlobalVessels([]));
    }
  }, [showVessels]);

  useEffect(() => {
    if (!showVessels) return;

    const socket = new WebSocket(AIS_WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("[AIS] connected");

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

        setVesselMap((prev) => {
          const next = { ...prev };

          for (const [mmsiStr, newSnapshots] of Object.entries(msg.snapshots)) {
            const mmsi = String(mmsiStr);
            const existing = next[mmsi] ?? [];

            const merged = [...existing, ...(newSnapshots as AISVessel[])];

            const dedupedMap = new Map<number, AISVessel>();
            for (const s of merged) {
              dedupedMap.set(s.timestamp_ms, s);
            }

            const sorted = Array.from(dedupedMap.values()).sort((a, b) => a.timestamp_ms - b.timestamp_ms);

            next[mmsi] = sorted;
          }

          return next;
        });

        const flat = Object.values(msg.snapshots)
          .map((trajectory: any) => {
            if (!trajectory.length) return null;
            return trajectory[trajectory.length - 1];
          })
          .filter(Boolean);

        dispatch(setGlobalVessels(flat));

        if (msg.type === "init") {
          const currentTime = Date.now();
          const diff = msg.end_time - msg.start_time;
          dispatch(setTimeRange({ startTime: currentTime - diff, endTime: currentTime }));
        }
        if (msg.type === "append") {
          const diff = msg.end_time - msg.start_time;
          dispatch(setEndTime(diff));
        }
      } catch (err) {
        console.error("[AIS parse error]", err);
      }
    };

    socket.onerror = (err) => {
      console.error("[AIS websocket error]", err);
    };

    socket.onclose = () => {
      console.log("[AIS websocket closed]");
      clock.setTime(0);
      dispatch(clearTimeRange());
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
      if (socket.readyState !== WebSocket.OPEN) return;

      const bounds = getBounds(viewer);
      if (!bounds) return;

      socket.send(JSON.stringify(bounds));
    };

    const debounced = () => {
      if (timeout) window.clearTimeout(timeout);

      timeout = window.setTimeout(sendBounds, 150);
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
    return Object.entries(vesselMap)
      .map(([mmsi, snapshots]) => {
        const latest = snapshots[snapshots.length - 1];
        if (!latest) return null;

        const isSelected = selectedVessel?.mmsi === Number(mmsi);

        return <VesselEntity key={mmsi} vessel={latest} snapshots={snapshots} isSelected={isSelected} />;
      })
      .filter((el): el is JSX.Element => el !== null);
  }, [vesselMap, selectedVessel]);

  return {
    vesselEntities,
    showVessels,
  };
};

export default useVessels;
