import { useState } from "react";
import { type IGuides, guides, type ITopicGuide } from "./guides";

const initGuideState = {
  drawing: false,
  vessels: false,
  aircraft: false,
  "report-builder": false,
};

interface IGuideState {
  expanded: IGuides;
  guides: ITopicGuide[];
  handleToggleExpand: (key: keyof IGuides) => void;
}

const useGuides = (): IGuideState => {
  const [expanded, setExpanded] = useState<IGuides>(initGuideState);
  const handleToggleExpand = (key: keyof IGuides) => {
    setExpanded({
      ...expanded,
      [key]: !expanded[key],
    });
  };

  return {
    guides,
    expanded,
    handleToggleExpand,
  };
};

export default useGuides;
