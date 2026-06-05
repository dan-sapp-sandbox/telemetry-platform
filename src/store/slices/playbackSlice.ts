import { createSlice } from "@reduxjs/toolkit";

export interface PlaybackState {
  isPlaying: boolean;
  speed: number;
  startTime: number | null;
  endTime: number | null;
}

const initialState: PlaybackState = {
  isPlaying: true,
  speed: 1,
  startTime: null,
  endTime: null,
};

const playbackSlice = createSlice({
  name: "playback",
  initialState,
  reducers: {
    play(state) {
      state.isPlaying = true;
    },
    pause(state) {
      state.isPlaying = false;
    },
    setSpeed(state, action) {
      state.speed = action.payload;
    },
    setTimeRange(state, action) {
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
    },
    appendRange(state, action) {
      const currentTime = Date.now();
      if (!state.startTime) {
        state.startTime = currentTime - (action.payload.endTime - action.payload.startTime);
      }
      if (!state.endTime) {
        state.endTime = currentTime;
      } else {
        state.endTime = state.endTime + action.payload.endTime - action.payload.startTime;
      }
    },
    setStartTime(state, action) {
      if (!state.startTime) state.startTime = action.payload;
    },
    setEndTime(state, action) {
      state.endTime = state.endTime + action.payload;
    },
    clearTimeRange(state) {
      state.startTime = null;
      state.endTime = null;
    },
  },
});

export const { appendRange, clearTimeRange, setTimeRange, setStartTime, setEndTime, play, pause, setSpeed } =
  playbackSlice.actions;

export default playbackSlice.reducer;
