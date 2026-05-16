import useActionPallet from "./useActionPallet";
import { palletWrapperStyles } from "./utils";

const ActionPallet = () => {
  const { getActivePanel } = useActionPallet();

  return <div className={palletWrapperStyles}>{getActivePanel()}</div>;
};

export default ActionPallet;
