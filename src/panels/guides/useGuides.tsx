import { useState, type JSX } from "react";
import { Edit, FileText, Ship, Plane } from "lucide-react";

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
  icon: JSX.Element;
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
      icon: <Edit />,
      content: "How to make dots, how to make lines, how to make labels, how to upload/download features as geojson",
    },
    {
      id: "vessels",
      title: "Vessels",
      icon: <Ship />,
      content: "How to view vessel detail, how to search for vessel, how to flyTo vessel",
    },
    {
      id: "aircraft",
      title: "Aircraft",
      icon: <Plane />,
      content: "How to view aircraft detail, how to search for aircraft, how to flyTo aircraft",
    },
    {
      id: "report-builder",
      title: "Report Builder",
      icon: <FileText />,
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
