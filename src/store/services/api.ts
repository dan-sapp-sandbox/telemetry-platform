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
    baseUrl: "https://sandbox-api-nifl.onrender.com/api/",
  }),
  endpoints: (builder) => ({
    getVessels: builder.query<Vessel[], VesselBounds>({
      async queryFn(bounds, _api, _extraOptions, fetchWithBQ) {
        const result = await fetchWithBQ({
          url: "vessels",
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
  }),
});

export const { useGetVesselsQuery } = api;
