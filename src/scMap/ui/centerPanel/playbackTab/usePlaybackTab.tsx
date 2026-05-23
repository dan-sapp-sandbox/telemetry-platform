import { setSpeed, play, pause, type PlaybackState } from "@/store/slices/playbackSlice";
import { useSelector, useDispatch } from "react-redux";

const usePlaybackTab = () => {
  const dispatch = useDispatch();
  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const handlePlay = () => {
    dispatch(play());
  };
  const handlePause = () => {
    dispatch(pause());
  };
  const handleSetSpeed = (speed: number) => {
    dispatch(setSpeed(speed));
  };

  return {
    isPlaying,
    speed,
    handlePlay,
    handlePause,
    handleSetSpeed,
  };
};

export default usePlaybackTab;
