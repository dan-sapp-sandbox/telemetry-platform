import { cn } from "@/lib/utils";
import AITab from "./aITab/AITab";
import DetailsTab from "./detailsTab/DetailsTab";
import AboutTab from "./aboutTab/AboutTab";
import useCenterPanel from "./useCenterPanel";

const TabButton = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className={cn([
        "relative w-20 px-1 py-1 text-sm hover:text-(--text) transition",
        active ? "text-(--text)" : "text-(--text)/80 ",
      ])}
    >
      <span>{label}</span>
      <span
        className={cn([
          "absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-emerald-400/95",
          "shadow-[0_0_8px_rgba(34,211,238,0.6)]",
          "transition-all duration-200 origin-center",
          active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
        ])}
      />
    </button>
  );
};

const CenterPanel = () => {
  const { activeTab, setActiveTab } = useCenterPanel();
  return (
    <div
      className={cn([
        "absolute md:static bottom-42 flex w-full md:flex-1 h-50 md:h-48 xl:h-68 flex-col ",
        "border-t border-emerald-400/30 bg-zinc-900/70 backdrop-blur-xl shadow-2xl overflow-hidden",
      ])}
    >
      <div className="flex items-center h-10 px-4 border-b border-zinc-400/30 bg-zinc-400/10">
        <TabButton active={activeTab === "ai"} onClick={() => setActiveTab("ai")} label="AI" />
        <TabButton active={activeTab === "details"} onClick={() => setActiveTab("details")} label="Details" />
        <TabButton active={activeTab === "about"} onClick={() => setActiveTab("about")} label="About" />
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "ai" && <AITab />}
        {activeTab === "details" && <DetailsTab />}
        {activeTab === "about" && <AboutTab />}
      </div>
    </div>
  );
};

export default CenterPanel;
