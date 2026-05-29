import { setSpeed, play, pause, type PlaybackState } from "@/store/slices/playbackSlice";
import { useSelector, useDispatch } from "react-redux";

const usePlaybackTab = () => {
  const dispatch = useDispatch();
  const { isPlaying, speed } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const speeds = [0.5, 1, 1.5, 2, 3];
  const currentIndex = speeds.indexOf(speed);

  const handlePlay = () => {
    dispatch(play());
  };
  const handlePause = () => {
    dispatch(pause());
  };
  const handleIncreaseSpeed = () => {
    const nextIndex = Math.min(currentIndex + 1, speeds.length - 1);
    dispatch(setSpeed(speeds[nextIndex]));
  };

  const handleDecreaseSpeed = () => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    dispatch(setSpeed(speeds[prevIndex]));
  };

  return {
    isPlaying,
    speed,
    handlePlay,
    handlePause,
    handleIncreaseSpeed,
    handleDecreaseSpeed,
  };
};

export default usePlaybackTab;
