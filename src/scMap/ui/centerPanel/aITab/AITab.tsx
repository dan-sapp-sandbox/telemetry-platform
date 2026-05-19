const AITab = () => {
  return (
    <div className="flex flex-col h-full gap-3">
      <div className="text-xs text-zinc-400">Command Interface</div>

      <input
        className="h-10 px-3 rounded-lg bg-zinc-800/60 border border-white/10 outline-none text-(--text)"
        placeholder="Ask SC Intelligence... /track /analyze /draw"
      />

      <div className="flex-1 space-y-2 overflow-auto">
        <div className="p-2 rounded bg-zinc-800/40 border border-white/10">Ready for commands.</div>
      </div>
    </div>
  );
};

export default AITab;
