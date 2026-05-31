import { useSelector } from "react-redux";
import type { mapState } from "@/store/slices/mapSlice";

export interface IDetailsTab {
  activeDetails: "vessels" | "aircraft" | null;
}

const useDetailsTab = (): IDetailsTab => {
  const { dataLayer } = useSelector((state: { map: mapState }) => state.map);

  let activeDetails = null;
  if (dataLayer === "vessels" || dataLayer === "aircraft") {
    activeDetails = dataLayer;
  }

  return {
    activeDetails,
  };
};

export default useDetailsTab;
