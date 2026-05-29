import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface AISVessel {
  mmsi: number;
  ship_name: string | null;
  lon: number;
  lat: number;
  sog: number | null;
  cog: number | null;
  heading: number | null;
  nav_status: number | null;
  rot: number | null;
  timestamp_ms: number;
}

export type AircraftMap = Record<string, Aircraft[]>;

export type Aircraft = {
  icao: string;
  callsign: string | null;
  origin_country: string;

  lon: number;
  lat: number;
  altitude_m: number | null;
  velocity_mps: number | null;
  heading_deg: number | null;
  vertical_rate: number | null;
  squawk: string | null;
  snapshot_time: number;
};

export interface CommandResponse {
  action: string | null;
  args: Record<string, any>;
}

export interface CommandRequest {
  prompt: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://sandbox-api-nifl.onrender.com/api/",
    // baseUrl: "http://127.0.0.1:8000/api/",
  }),
  endpoints: (builder) => ({
    sendCommandPrompt: builder.mutation<CommandResponse, CommandRequest>({
      query: (body) => ({
        url: "ai/commands",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendCommandPromptMutation } = api;
