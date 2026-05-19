import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Vessel } from "../slices/vesselSlice";

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
    getVessels: builder.query<Vessel[], VesselBounds>({
      async queryFn(bounds, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({
          url: "vessels/get-vessels",
          params: bounds,
        });

        if (result.error) {
          return {
            error: result.error,
          };
        }

        return {
          data: result.data as Vessel[],
        };
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

export const { useGetVesselsQuery, useSendCommandPromptMutation } = api;
