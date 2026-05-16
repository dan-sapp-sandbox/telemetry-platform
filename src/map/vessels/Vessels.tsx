import useVessels from "./useVessels";

const Vessels = () => {
  const { vesselEntities, showVessels } = useVessels();
  return showVessels && vesselEntities;
};

export default Vessels;
