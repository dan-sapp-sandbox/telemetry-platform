import useDetailsTab from "./useDetailsTab";
import VesselDetails from "./vesselDetails/VesselDetails";
import AircraftDetails from "./aircraftDetails/AircraftDetails";

const DetailsTab = () => {
  const { activePanel } = useDetailsTab();
  switch (activePanel) {
    case "vessels":
      return <VesselDetails />;
    case "aircraft":
      return <AircraftDetails />;
    default:
      return <div className="text-sm md:text-base text-(--text)/80 p-3">Choose a Topic from the Action Pallet</div>;
  }
};

export default DetailsTab;
