import useAircraft from "./useAircraft";

const Aircraft = () => {
  const { aircraftEntities, showAircraft } = useAircraft();
  return showAircraft && aircraftEntities;
};

export default Aircraft;
