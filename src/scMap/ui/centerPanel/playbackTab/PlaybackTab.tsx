import { FastForward, Pause, Play, Rewind } from "lucide-react";
import usePlaybackTab from "./usePlaybackTab";
import { cn } from "@/lib/utils";

const PlaybackTab = () => {
  const { isPlaying, speed, handlePlay, handlePause, handleIncreaseSpeed, handleDecreaseSpeed } = usePlaybackTab();

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      <div className="text-xs md:text-sm text-(--text)/80">{speed}x</div>
      <div className="flex gap-2">
        <button
          className={cn([
            "text-xs md:text-sm",
            speed === 1 ? "text-(--text)/40 border-(--text)/40" : "text-(--text)/80 border-emerald-400/60",
          ])}
          onClick={handleDecreaseSpeed}
        >
          <Rewind />
        </button>
        <button
          className="text-xs md:text-sm text-(--text)/80 border-emerald-400/60"
          onClick={() => (isPlaying ? handlePause() : handlePlay())}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button
          className={cn([
            "text-xs md:text-sm",
            speed === 500 ? "text-(--text)/40 border-(--text)/40" : "text-(--text)/80 border-emerald-400/60",
          ])}
          onClick={handleIncreaseSpeed}
        >
          <FastForward />
        </button>
      </div>
    </div>
  );
};

export default PlaybackTab;
