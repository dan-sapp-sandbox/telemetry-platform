import useDetailsTab from "./useDetailsTab";
import VesselDetails from "./vesselDetails/VesselDetails";

const DetailsTab = () => {
  const { activePanel } = useDetailsTab();
  if (activePanel === "vessels") {
    return <VesselDetails />;
  }
  return <div>Choose a Topic from the Action Pallet</div>;
};

export default DetailsTab;
