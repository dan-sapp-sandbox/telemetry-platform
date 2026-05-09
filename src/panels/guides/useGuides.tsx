import { useState, type JSX } from "react";
import { Edit, FileText, Ship, Plane, Edit2 } from "lucide-react";

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
  content: JSX.Element;
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
      content: (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="font-bold">Adding Features</span>
            <span className="ml-4 text-base">Click Point/Line/Polygon, then click on the map</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Adding Labels</span>
            <span className="ml-4 text-base flex flex-row items-center">
              Find feature in list and click <Edit2 className="size-8 px-2" /> to rename
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Import/Export Features as GeoJSON</span>
            <span className="ml-4 text-base">Click Point/Line/Polygon, then click on the map</span>
          </div>
        </div>
      ),
    },
    {
      id: "vessels",
      title: "Vessels",
      icon: <Ship />,
      content: (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="font-bold">Show/Hide Vessels</span>
            <span className="ml-4 text-base">...</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Search for Vessel</span>
            <span className="ml-4 text-base">...</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Center on Vessel</span>
            <span className="ml-4 text-base">...</span>
          </div>
        </div>
      ),
    },
    {
      id: "aircraft",
      title: "Aircraft",
      icon: <Plane />,
      content: (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="font-bold">Show/Hide Aircraft</span>
            <span className="ml-4 text-base">...</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Search for Aircraft</span>
            <span className="ml-4 text-base">...</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Center on Aircraft</span>
            <span className="ml-4 text-base">...</span>
          </div>
        </div>
      ),
    },
    {
      id: "report-builder",
      title: "Report Builder",
      icon: <FileText />,
      content: (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <span className="font-bold">View Report</span>
            <span className="ml-4 text-base">...</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Add Text Section</span>
            <span className="ml-4 text-base">...</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Add Map Image</span>
            <span className="ml-4 text-base">...</span>
          </div>
        </div>
      ),
    },
  ];

  return {
    guides,
    expanded,
    handleToggleExpand,
  };
};

export default useGuides;
