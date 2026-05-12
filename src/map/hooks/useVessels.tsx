import { type JSX } from "react";
import type { vesselState } from "@/store/slices/vesselSlice";
import { useSelector } from "react-redux";
import VesselEntity from "../entities/VesselEntity";

export interface IVesselState {
  VesselEntities: () => JSX.Element[];
}

const useVessels = (): IVesselState => {
  const { vessels, showVessels } = useSelector((state: { vessels: vesselState }) => state.vessels);

  const VesselEntities = (): JSX.Element[] => {
    if (!showVessels) return [];
    return vessels.map((vessel) => <VesselEntity key={vessel.id} vessel={vessel} />);
  };

  return {
    VesselEntities,
  };
};

export default useVessels;
