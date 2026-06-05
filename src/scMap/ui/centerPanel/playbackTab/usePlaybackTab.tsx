import { setSpeed, play, pause, type PlaybackState } from "@/store/slices/playbackSlice";
import { useSelector, useDispatch } from "react-redux";
import { clock } from "@/map/simulationEngine";
import { useState, useEffect, type ChangeEvent } from "react";

const usePlaybackTab = () => {
  const dispatch = useDispatch();
  const { isPlaying, speed, startTime, endTime } = useSelector((state: { playback: PlaybackState }) => state.playback);

  const speeds = [0.5, 1, 1.5, 2, 3];
  const currentIndex = speeds.indexOf(speed);
  const [currentTime, setCurrentTime] = useState(clock.getTime() * 1000 + (startTime || 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(clock.getTime() * 1000 + (startTime || 0));
    }, 100);

    return () => clearInterval(interval);
  }, []);

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

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newTime = (Number(value) - (startTime || 0)) / 1000;
    clock.setTime(newTime);
  };

  const formatTimestamp = (timestamp?: number | null) => {
    if (!timestamp) return "--";

    return new Date(timestamp).toLocaleString([], {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return {
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
  };
};

export default usePlaybackTab;
