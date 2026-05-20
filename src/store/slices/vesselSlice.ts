import { createSlice } from "@reduxjs/toolkit";
import { Cartographic, Cartesian3, Math as CesiumMath } from "cesium";

const ecefPoints = [
  { x: 3560315.3411324266, y: 4287962.735034731, z: 3090918.0226236647 },
  { x: 3573652.066222284, y: 4321796.513121868, z: 3028187.063100148 },
  { x: 3575598.7348685265, y: 4380605.767121635, z: 2940703.4876877945 },
  { x: 3542762.9926311225, y: 4436447.7085168725, z: 2896695.2977514635 },
  { x: 3478875.927033006, y: 4520333.85964114, z: 2844312.2882643775 },
  { x: 3431415.854286219, y: 4594697.935458945, z: 2782550.3730762573 },
  { x: 3318918.1450745785, y: 4683871.358576399, z: 2770385.736952564 },
  { x: 3227577.145322822, y: 4727643.278095972, z: 2803532.6464098324 },
  { x: 3151007.5367215723, y: 4758681.499474512, z: 2837686.3756204364 },
  { x: 3125342.1170335375, y: 4784108.306156103, z: 2823376.05700767 },
  { x: 3136550.492326488, y: 4805332.145978311, z: 2774810.678524962 },
  { x: 3143629.946018645, y: 4832530.033164661, z: 2719381.722302891 },
  { x: 3132039.8055388634, y: 4872350.82583906, z: 2661468.9599040244 },
  { x: 3066734.3522795476, y: 4943806.110619544, z: 2605532.5863313978 },
  { x: 2999460.7402876955, y: 5004809.450128548, z: 2567357.981044906 },
  { x: 2976996.4474486522, y: 5049081.66091946, z: 2506502.902826223 },
  { x: 2937600.0944421454, y: 5105879.915822188, z: 2437434.6440322995 },
  { x: 2958466.655655883, y: 5139843.754563627, z: 2339492.6842492847 },
  { x: 3027954.370094131, y: 5140060.371908909, z: 2248958.906436783 },
  { x: 3084006.813580585, y: 5150406.611900541, z: 2147501.879690239 },
  { x: 3155044.6881899387, y: 5139377.48203928, z: 2069842.9916451431 },
  { x: 3218691.1712776423, y: 5128929.28262035, z: 1996964.4244019168 },
  { x: 3386702.607277417, y: 5075440.000962517, z: 1851400.81753531 },
  { x: 3618331.86394481, y: 4942010.824075144, z: 1773033.7119472036 },
  { x: 3760138.6653033122, y: 4886785.664196598, z: 1625884.0191569102 },
  { x: 3982700.4785193247, y: 4724641.356348853, z: 1574731.7394094642 },
  { x: 4198076.002300592, y: 4585860.793925132, z: 1418838.593408312 },
  { x: 4334755.322529878, y: 4461680.329626694, z: 1403800.3053600113 },
];

export type RoutePoint = {
  lat: number;
  lon: number;
};

export type Route = {
  id: string;
  name: string;
  points: RoutePoint[];
};

export type Vessel = {
  id: string;
  name: string;
  type: "Cargo" | "Tanker" | "Fishing" | "Passenger";
  lat: number;
  lon: number;
  heading: number; // radians
  speed: number;
};

export type RoutedVessel = {
  id: string;
  name: string;
  routeId: string;
  speedMps: number;
  startOffsetSeconds: number;
  routeOffsetMeters: number;
};

export const routedVessels: RoutedVessel[] = [
  {
    id: "vessel-1",
    name: "Sea Pidgeon",
    routeId: "hormuz",
    speedMps: 5000,
    startOffsetSeconds: 1000,
    routeOffsetMeters: 100,
  },
  {
    id: "vessel-2",
    name: "Sea Falcon",
    routeId: "hormuz",
    speedMps: 6000,
    startOffsetSeconds: 10000,
    routeOffsetMeters: 0,
  },
  {
    id: "vessel-3",
    name: "Sea Pheasant",
    routeId: "hormuz",
    speedMps: 7000,
    startOffsetSeconds: 0,
    routeOffsetMeters: 200,
  },
];

export const routes: Route[] = [
  {
    id: "hormuz",
    name: "Kharg Island → Oman",
    points: ecefPoints.map((p) => {
      const cart = Cartesian3.fromElements(p.x, p.y, p.z);
      const geo = Cartographic.fromCartesian(cart);

      return {
        lat: CesiumMath.toDegrees(geo.latitude),
        lon: CesiumMath.toDegrees(geo.longitude),
      };
    }),
  },
];

export interface vesselState {
  routes: Route[];
  routedVessels: RoutedVessel[];
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  showVessels: boolean;
  showVesselNames: boolean;
  showVesselPaths: boolean;
}

const initialState: vesselState = {
  routes,
  routedVessels,
  vessels: [],
  selectedVessel: null,
  showVessels: true,
  showVesselNames: false,
  showVesselPaths: false,
};

const vesselSlice = createSlice({
  name: "vessel",
  initialState,

  reducers: {
    setSelectedVessel: (state, action) => {
      state.selectedVessel = action.payload;
    },
    setVessels: (state, action) => {
      state.vessels = action.payload;
    },
    setShowVessels: (state, action) => {
      state.showVessels = action.payload;
    },
    setShowVesselNames: (state, action) => {
      state.showVesselNames = action.payload;
    },
    setShowVesselPaths: (state, action) => {
      state.showVesselPaths = action.payload;
    },
  },
});

export const { setSelectedVessel, setVessels, setShowVessels, setShowVesselNames, setShowVesselPaths } =
  vesselSlice.actions;

export default vesselSlice.reducer;
