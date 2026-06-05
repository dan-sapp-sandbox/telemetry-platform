import { FastForward, Pause, Play, Rewind } from "lucide-react";
import usePlaybackTab from "./usePlaybackTab";
import { cn } from "@/lib/utils";

const PlaybackTab = () => {
  const {
    isPlaying,
    speed,
    startTime,
    endTime,
    currentTime,
    handlePlay,
    handlePause,
    handleIncreaseSpeed,
    handleDecreaseSpeed,
    handleSeek,
    formatTimestamp,
  } = usePlaybackTab();

  return (
    <div className="flex flex-col justify-center items-center h-full gap-3 lg:gap-6 p-3">
      <div className="flex gap-2">
        <button
          className={cn([
            "mt-8 text-xs md:text-sm",
            speed === 0.5 ? "text-(--text)/40 border-(--text)/40" : "text-(--text)/80 border-emerald-400/60",
          ])}
          onClick={handleDecreaseSpeed}
        >
          <Rewind className="size-3 lg:size-5" />
        </button>
        <div className="flex flex-col justify-between lg:gap-2">
          <div className="text-center text-xs md:text-sm text-(--text)/80">{speed}x</div>
          <button
            className="text-xs md:text-sm text-(--text)/80 border-emerald-400/60"
            onClick={() => (isPlaying ? handlePause() : handlePlay())}
          >
            {isPlaying ? <Pause className="size-3 lg:size-5" /> : <Play className="size-3 lg:size-5" />}
          </button>
        </div>
        <button
          className={cn([
            "mt-8 text-xs md:text-sm",
            speed === 3 ? "text-(--text)/40 border-(--text)/40" : "text-(--text)/80 border-emerald-400/60",
          ])}
          onClick={handleIncreaseSpeed}
        >
          <FastForward className="size-3 lg:size-5" />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs lg:text-sm text-(--text)/80">{formatTimestamp(currentTime)}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs lg:text-sm text-(--text)/80">{formatTimestamp(startTime)}</span>
          <input
            className="accent-emerald-400"
            type="range"
            min={startTime ?? 0}
            max={endTime ?? 0}
            value={currentTime}
            onChange={handleSeek}
          />
          <span className="text-xs lg:text-sm text-(--text)/80">{formatTimestamp(endTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaybackTab;
