import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import useGuides from "./useGuides";

const GuidePanel = () => {
  const { expanded, guides, handleToggleExpand } = useGuides();
  return (
    <div className="w-full flex flex-col gap-4 md:gap-12 p-6">
      <div className="text-2xl font-bold">App Guide</div>
      <div className="w-full flex flex-col bg-(--foreground)/50 py-2">
        {guides.map((topic, i) => (
          <>
            <div key={topic.id} className={cn([expanded[topic.id] ? "" : "", ""])}>
              <div
                className="flex gap-2 items-center cursor-pointer text-xl px-2 py-6"
                onClick={() => handleToggleExpand(topic.id)}
              >
                {topic.icon}
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
