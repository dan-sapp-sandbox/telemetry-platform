import { useState } from "react";

interface IGuides {
  drawing: boolean;
  vessels: boolean;
  aircraft: boolean;
  "report-builder": boolean;
}
const initGuideState = {
  drawing: false,
  vessels: false,
  aircraft: false,
  "report-builder": false,
};

interface ITopicGuide {
  id: keyof IGuides;
  title: string;
  content: string;
}

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
  const guides: ITopicGuide[] = [
    {
      id: "drawing",
      title: "Drawing",
      content: "How to make dots, how to make lines, how to labels, how to upload/download features as geojson",
    },
    {
      id: "vessels",
      title: "Vessels",
      content: "How to view vessel detail, how to search for vessel, how to flyTo vessel",
    },
    {
      id: "aircraft",
      title: "Aircraft",
      content: "How to view aircraft detail, how to search for aircraft, how to flyTo aircraft",
    },
    {
      id: "report-builder",
      title: "Report Builder",
      content: "How to view report, how to add text section, how to add map image",
    },
  ];

  return {
    guides,
    expanded,
    handleToggleExpand,
  };
};

export default useGuides;
