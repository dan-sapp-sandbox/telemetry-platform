import { type JSX } from "react";
import { Edit, FileText, Ship, Plane, Edit2 } from "lucide-react";

export interface IGuides {
  drawing: boolean;
  vessels: boolean;
  aircraft: boolean;
  "report-builder": boolean;
}

export interface ITopicGuide {
  id: keyof IGuides;
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
}

export const guides: ITopicGuide[] = [
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
          <span className="font-bold">Adding Icons</span>
          <span className="ml-4 text-base flex flex-row items-center">Right Click on the map, click Add Marker</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Adding Labels</span>
          <span className="ml-4 text-base flex flex-row items-center">
            Find feature in list and click <Edit2 className="size-8 px-2" /> to rename
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Import/Export Features as GeoJSON</span>
          <span className="ml-4 text-base">
            Click Point/Line/Polygon, then click on the map, double click to end line/polygon
          </span>
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
