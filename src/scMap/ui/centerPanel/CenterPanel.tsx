import { cn } from "@/lib/utils";
import { useState } from "react";
import AITab from "./AITab";
import DetailsTab from "./detailsTab/DetailsTab";

type TabId = "ai" | "details" | "logs";

const TabButton = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => {
  return (
    <button onClick={onClick} className="relative px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition">
      {label}
      <span
        className={cn([
          "absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-cyan-400",
          "shadow-[0_0_8px_rgba(34,211,238,0.6)]",
          "transition-all duration-200 origin-center",
          active ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
        ])}
      />
    </button>
  );
};

const LogsTab = () => {
  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="text-zinc-400">system initialized</div>
      <div className="text-zinc-400">viewer ready</div>
      <div className="text-zinc-400">tracking engine idle</div>
    </div>
  );
};

const CenterPanel = () => {
  const [activeTab, setActiveTab] = useState<TabId>("details");
  return (
    <div className="flex-1 h-35 lg:h-48 xl:h-68 flex flex-col border border-white/10 bg-zinc-900/70 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex items-center gap-1 h-10 px-6 border-b border-white/10 bg-zinc-950/40">
        <TabButton active={activeTab === "ai"} onClick={() => setActiveTab("ai")} label="AI" />

        <TabButton active={activeTab === "details"} onClick={() => setActiveTab("details")} label="Details" />

        <TabButton active={activeTab === "logs"} onClick={() => setActiveTab("logs")} label="Logs" />
      </div>

      <div className="flex-1 overflow-auto p-3 text-sm text-zinc-200">
        {activeTab === "ai" && <AITab />}
        {activeTab === "details" && <DetailsTab />}
        {activeTab === "logs" && <LogsTab />}
      </div>
    </div>
  );
};

export default CenterPanel;
