import { useEffect, useRef } from "react";

interface NormalizedAISVessel {
  mmsi: number;
  timestamp: number;

  latitude: number;
  longitude: number;

  sog: number | null;
  cog: number | null;
  heading: number | null;

  navStatus: number | null;
  rot: number | null;

  shipName: string | null;
}

const AIS_WS_URL = "wss://stream.aisstream.io/v0/stream";

const CAPTURE_DURATION_MS = 10 * 60 * 1000;

const FLUSH_INTERVAL_MS = 5000;

const useAISIngest = () => {
  const socketRef = useRef<WebSocket | null>(null);

  const bufferRef = useRef<NormalizedAISVessel[]>([]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_AISSTREAM_API_KEY;

    if (!apiKey) {
      console.error("Missing AISStream API key");
      return;
    }

    const captureSessionId = crypto.randomUUID();

    console.log("Starting AIS capture session:", captureSessionId);

    const socket = new WebSocket(AIS_WS_URL);

    socketRef.current = socket;

    const flushInterval = setInterval(async () => {
      if (bufferRef.current.length === 0) {
        return;
      }

      const batch = [...bufferRef.current];

      bufferRef.current = [];

      try {
        console.log("Uploading AIS batch:", batch.length);

        await fetch("http://127.0.0.1:8000/api/vessels/ingest-ais", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            captureSessionId,
            vessels: batch,
          }),
        });
      } catch (err) {
        console.error("AIS batch upload failed:", err);

        bufferRef.current.unshift(...batch);
      }
    }, FLUSH_INTERVAL_MS);

    const stopCaptureTimeout = setTimeout(() => {
      console.log("Ending AIS capture session");

      socket.close();
    }, CAPTURE_DURATION_MS);

    socket.onopen = () => {
      console.log("AIS websocket connected");

      socket.send(
        JSON.stringify({
          APIKey: apiKey,

          BoundingBoxes: [
            [
              [-90, -180],
              [90, 180],
            ],
          ],

          FilterMessageTypes: ["PositionReport"],
        }),
      );
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

        if (data.MessageType !== "PositionReport") {
          return;
        }

        const report = data.Message?.PositionReport;
        const meta = data.MetaData;

        if (!report || !meta) {
          return;
        }

        if (report.Latitude == null || report.Longitude == null) {
          return;
        }

        const normalized: NormalizedAISVessel = {
          mmsi: meta.MMSI,

          timestamp: Date.now(),

          latitude: report.Latitude,
          longitude: report.Longitude,

          sog: typeof report.Sog === "number" ? report.Sog : null,

          cog: typeof report.Cog === "number" ? report.Cog : null,

          heading: typeof report.TrueHeading === "number" && report.TrueHeading <= 360 ? report.TrueHeading : null,

          navStatus: typeof report.NavigationalStatus === "number" ? report.NavigationalStatus : null,

          rot: typeof report.RateOfTurn === "number" ? report.RateOfTurn : null,

          shipName: typeof meta.ShipName === "string" ? meta.ShipName.trim() : null,
        };

        bufferRef.current.push(normalized);
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
      clearTimeout(stopCaptureTimeout);

      clearInterval(flushInterval);

      socket.close();

      socketRef.current = null;
    };
  }, []);
};

export default useAISIngest;
