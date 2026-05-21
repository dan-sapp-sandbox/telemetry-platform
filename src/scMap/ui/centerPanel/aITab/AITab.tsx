import { CheckCircle } from "lucide-react";
import useAITab from "./useAITab";

const AITab = () => {
  const { handleSendCommandPrompt, prompt, setPrompt, isLoading, toolActions } = useAITab();

  const onSend = () => {
    if (!prompt.trim()) return;
    handleSendCommandPrompt();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      <div className="text-xs md:text-sm text-(--text)/80">Command Interface</div>

      <div className="w-full flex gap-2">
        <input
          className="flex-1 h-8 md:h-10 px-3 rounded-lg bg-zinc-800/60 border border-white/10 outline-none text-sm md:text-base text-(--text)"
          placeholder="vessels in the strait of hormuz"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <button
          onClick={onSend}
          disabled={isLoading}
          className="w-22 rounded-lg text-sm md:text-base text-(--text)/80 bg-zinc-600/80 hover:border-emerald-400/60 hover:text-emerald-400/60 disabled:opacity-50 px-2 py-1"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>
      <div className="w-full px-2">
        {toolActions.map((action) => (
          <div key={action} className="text-(--text)/60 text-xs md:text-sm flex items-center gap-1">
            <CheckCircle className="text-(--text)/80 size-4" />
            {action}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITab;
