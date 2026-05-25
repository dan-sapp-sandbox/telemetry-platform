import { useSelector } from "react-redux";
import type { actionPallet } from "@/store/slices/actionPalletSlice";
import type { actionPanel } from "../../actionPallet/utils";
import type { mapState } from "@/store/slices/mapSlice";

export interface IDetailsTab {
  activePanel: actionPanel | null;
}

const useDetailsTab = (): IDetailsTab => {
  const { activePanel } = useSelector((state: { actionPallet: actionPallet }) => state.actionPallet);

  const { dataLayer } = useSelector((state: { map: mapState }) => state.map);

  let panel = activePanel;
  if (dataLayer === "vessels" || dataLayer === "aircraft") {
    panel = dataLayer;
  }

  return {
    activePanel: panel,
  };
};

export default useDetailsTab;
