import { createSlice } from "@reduxjs/toolkit";

export interface PlaybackState {
  simulationTimeMs: number;
  isPlaying: boolean;
  speed: number;
}

const initialState: PlaybackState = {
  simulationTimeMs: 0,
  isPlaying: true,
  speed: 1,
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

    seek(state, action) {
      state.simulationTimeMs = action.payload;
    },

    advanceSimulationTime(state, action) {
      state.simulationTimeMs += action.payload;
    },
  },
});

export const { play, pause, setSpeed, seek, advanceSimulationTime } = playbackSlice.actions;

export default playbackSlice.reducer;
