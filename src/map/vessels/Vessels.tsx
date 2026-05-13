import useVessels from "./useVessels";

const Vessels = () => {
  const { VesselEntities, showVessels } = useVessels();
  return showVessels ? <VesselEntities /> : null;
};

export default Vessels;
