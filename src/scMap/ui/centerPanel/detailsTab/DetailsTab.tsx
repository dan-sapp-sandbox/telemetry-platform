import useDetailsTab from "./useDetailsTab";
import VesselDetails from "./vesselDetails/VesselDetails";
import AircraftDetails from "./aircraftDetails/AircraftDetails";

const DetailsTab = () => {
  const { activeDetails } = useDetailsTab();
  switch (activeDetails) {
    case "vessels":
      return <VesselDetails />;
    case "aircraft":
      return <AircraftDetails />;
    default:
      return <div className="p-8 text-(--text)/80">Select a Data Layer</div>;
  }
};

export default DetailsTab;
