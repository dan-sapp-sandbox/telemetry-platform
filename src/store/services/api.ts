import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Vessel } from "../slices/vesselSlice";
import mockVessels from "../../../data/vessels.json";

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
      async queryFn(bounds, _api, _extraOptions, fetchWithBQ) {
        if (import.meta.env.DEV) {
          const filtered = mockVessels.filter((vessel) => {
            const { north, south, east, west } = bounds;
            const inLatitude = vessel.lat >= south && vessel.lat <= north;

            let inLongitude = false;

            // handle international date line
            if (west <= east) {
              inLongitude = vessel.lon >= west && vessel.lon <= east;
            } else {
              inLongitude = vessel.lon >= west || vessel.lon <= east;
            }

            return inLatitude && inLongitude;
          });
          return {
            data: filtered as Vessel[],
          };
        }

        // production uses API
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
