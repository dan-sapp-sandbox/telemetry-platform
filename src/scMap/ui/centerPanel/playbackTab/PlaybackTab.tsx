import usePlaybackTab from "./usePlaybackTab";

const PlaybackTab = () => {
  const {} = usePlaybackTab();

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      <div className="text-xs md:text-sm text-(--text)/80">Playback Tab</div>
    </div>
  );
};

export default PlaybackTab;
