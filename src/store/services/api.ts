import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Route } from "../slices/vesselSlice";

export interface IBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export type Vessel = {
  id: string;
  name: string;
  routeId: string;
  speedMps: number;
  startOffsetSeconds: number;
  routeOffsetMeters: number;
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
    getVessels: builder.query<Vessel[], void>({
      query: () => "vessels/get-vessels",
    }),
    getRoutes: builder.query<Route[], void>({
      query: () => "vessels/get-routes",
      transformResponse: (response: any[]): Route[] => {
        return response.map((r) => ({
          id: r.id,
          name: r.name,
          points: r.points,
        }));
      },
    }),
    getAircraft: builder.query<Vessel[], void>({
      query: () => "aircraft/get-aircraft",
    }),
    getAirRoutes: builder.query<Route[], void>({
      query: () => "aircraft/get-air-routes",
      transformResponse: (response: any[]): Route[] => {
        return response.map((r) => ({
          id: r.id,
          name: r.name,
          points: r.points,
        }));
      },
    }),
    sendCommandPrompt: builder.mutation<CommandResponse, CommandRequest>({
      query: (body) => ({
        url: "ai/commands",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetVesselsQuery,
  useGetRoutesQuery,
  useSendCommandPromptMutation,
  useGetAirRoutesQuery,
  useGetAircraftQuery,
} = api;
