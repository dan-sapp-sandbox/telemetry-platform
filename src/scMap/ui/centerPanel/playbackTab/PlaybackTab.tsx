import { FastForward, Pause, Play, Rewind } from "lucide-react";
import usePlaybackTab from "./usePlaybackTab";
import { cn } from "@/lib/utils";

const PlaybackTab = () => {
  const { isPlaying, speed, handlePlay, handlePause, handleIncreaseSpeed, handleDecreaseSpeed } = usePlaybackTab();

  return (
    <div className="flex justify-center items-center h-full gap-3 p-3">
      <div className="flex gap-2">
        <button
          className={cn([
            "mt-8 text-xs md:text-sm",
            speed === 0.5 ? "text-(--text)/40 border-(--text)/40" : "text-(--text)/80 border-emerald-400/60",
          ])}
          onClick={handleDecreaseSpeed}
        >
          <Rewind />
        </button>
        <div className="flex flex-col gap-2">
          <div className="text-center text-sm md:text-base text-(--text)/80">{speed}x</div>
          <button
            className="text-xs md:text-sm text-(--text)/80 border-emerald-400/60"
            onClick={() => (isPlaying ? handlePause() : handlePlay())}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
        <button
          className={cn([
            "mt-8 text-xs md:text-sm",
            speed === 3 ? "text-(--text)/40 border-(--text)/40" : "text-(--text)/80 border-emerald-400/60",
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
