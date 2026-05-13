import useVessels from "./useVessels";

const Vessels = () => {
  const { VesselEntities } = useVessels();
  return <VesselEntities />;
};

export default Vessels;
