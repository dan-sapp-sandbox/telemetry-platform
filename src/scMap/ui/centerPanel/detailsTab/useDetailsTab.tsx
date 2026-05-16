import { useSelector } from "react-redux";
import type { actionPallet } from "@/store/slices/actionPalletSlice";
import type { actionPanel } from "../../actionPallet/utils";

export interface IDetailsTab {
  activePanel: actionPanel | null;
}

const useDetailsTab = (): IDetailsTab => {
  const { activePanel } = useSelector((state: { actionPallet: actionPallet }) => state.actionPallet);

  return {
    activePanel,
  };
};

export default useDetailsTab;
