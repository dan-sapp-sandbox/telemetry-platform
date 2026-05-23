import { FastForward, Pause, Play, Rewind } from "lucide-react";
import usePlaybackTab from "./usePlaybackTab";

const PlaybackTab = () => {
  const { isPlaying, speed, handlePlay, handlePause, handleSetSpeed } = usePlaybackTab();

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      <div className="text-xs md:text-sm text-(--text)/80">{speed}x</div>
      <div className="flex gap-2">
        <button
          className="text-xs md:text-sm text-(--text)/80 border-emerald-400/60"
          onClick={() => handleSetSpeed(speed - 0.5)}
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
          className="text-xs md:text-sm text-(--text)/80 border-emerald-400/60"
          onClick={() => handleSetSpeed(speed + 0.5)}
        >
          <FastForward />
        </button>
      </div>
    </div>
  );
};

export default PlaybackTab;
