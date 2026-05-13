import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Vessel } from "../slices/vesselSlice";

export interface VesselBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  endpoints: (builder) => ({
    getVessels: builder.query<Vessel[], VesselBounds>({
      query: ({ west, south, east, north }) => ({
        url: "vessels",
        params: {
          west,
          south,
          east,
          north,
        },
      }),
    }),
  }),
});

export const { useGetVesselsQuery } = api;
