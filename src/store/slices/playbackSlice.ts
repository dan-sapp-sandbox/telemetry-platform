import { createSlice } from "@reduxjs/toolkit";

export interface PlaybackState {
  isPlaying: boolean;
  speed: number;
}

const initialState: PlaybackState = {
  isPlaying: true,
  speed: 100,
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
  },
});

export const { play, pause, setSpeed } = playbackSlice.actions;

export default playbackSlice.reducer;
