import useAITab from "./useAITab";

const AITab = () => {
  const { handleSendCommandPrompt, prompt, setPrompt, isLoading } = useAITab();

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
      <div className="text-sm text-zinc-400">Command Interface</div>

      <div className="w-full flex gap-2">
        <input
          className="flex-1 h-10 px-3 rounded-lg bg-zinc-800/60 border border-white/10 outline-none text-(--text)"
          placeholder="Ask AI to show you a location"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <button
          onClick={onSend}
          disabled={isLoading}
          className="w-22 rounded-lg text-(--text)/80 bg-zinc-600/80 hover:border-emerald-400/60 hover:text-emerald-400/60 disabled:opacity-50 px-2 py-1"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default AITab;
