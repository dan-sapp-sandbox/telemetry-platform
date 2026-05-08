import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
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
const GuidePanel = () => {
  const [expanded, setExpanded] = useState<IGuides>(initGuideState);
  const handleToggleExpand = (key: keyof IGuides) => {
    setExpanded({
      ...expanded,
      [key]: !expanded[key],
    });
  };
  interface ITopicGuide {
    id: keyof IGuides;
    title: string;
    content: string;
  }
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
  return (
    <div className="w-full flex flex-col gap-4 md:gap-12 p-6">
      <div className="text-2xl font-bold">App Guide</div>
      <div className="w-full flex flex-col bg-(--foreground)/50 py-2">
        {guides.map((topic, i) => (
          <>
            <div className={cn([expanded[topic.id] ? "" : "", ""])}>
              <div
                className="flex gap-2 items-center cursor-pointer text-xl px-2 py-6"
                onClick={() => handleToggleExpand(topic.id)}
              >
                {topic.title}
                {expanded[topic.id] ? <ChevronUp /> : <ChevronDown />}
              </div>
              {expanded[topic.id] && <div className="text-lg p-6 bg-(--foreground)/70">{topic.content}</div>}
            </div>
            {i < guides.length - 1 && <Separator />}
          </>
        ))}
      </div>
    </div>
  );
};

export default GuidePanel;
