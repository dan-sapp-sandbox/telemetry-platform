import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Route, RoutedVessel } from "../slices/vesselSlice";

export interface VesselBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

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
    getVessels: builder.query<RoutedVessel[], void>({
      query: () => "vessels/get-vessels",
    }),

    getRoutes: builder.query<Route[], void>({
      query: () => "vessels/get-routes",
      transformResponse: (response: any[]): Route[] => {
        return response.map((r) => ({
          id: r.id,
          name: r.name,
          points: r.points, // already [{lat, lon}] from backend
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

export const { useGetVesselsQuery, useGetRoutesQuery, useSendCommandPromptMutation } = api;
