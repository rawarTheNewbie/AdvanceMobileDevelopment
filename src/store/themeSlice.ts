import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'custom';

export type ThemeState = {
  mode: ThemeMode;
  accent: string; // custom accent
  // derived palette (kept in state so we can persist + animate off it)
  colors: {
    background: string;
    card: string;
    text: string;
    muted: string;
    accent: string;
  };
};

const lightPalette = (accent: string) => ({
  background: '#FFFFFF',
  card: '#F5F5F5',
  text: '#0B0B0B',
  muted: '#8A8A8E',
  accent,
});

const darkPalette = (accent: string) => ({
  background: '#0B0B0B',
  card: '#151515',
  text: '#FFFFFF',
  muted: '#8A8A8E',
  accent,
});

const initialAccent = '#1DB954'; // Spotify green as default
const initialState: ThemeState = {
  mode: 'light',
  accent: initialAccent,
  colors: lightPalette(initialAccent),
};

const slice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      state.colors =
        state.mode === 'dark'
          ? darkPalette(state.accent)
          : state.mode === 'light'
          ? lightPalette(state.accent)
          : state.colors; // custom keeps current palette (set via setAccent / setCustomPalette)
    },
    toggleMode(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      state.colors =
        state.mode === 'dark'
          ? darkPalette(state.accent)
          : lightPalette(state.accent);
    },
    setAccent(state, action: PayloadAction<string>) {
      state.accent = action.payload;
      // respect current mode
      if (state.mode === 'dark') state.colors = darkPalette(state.accent);
      else if (state.mode === 'light') state.colors = lightPalette(state.accent);
      else state.colors.accent = state.accent; // custom
    },
    setCustomPalette(
      state,
      action: PayloadAction<Partial<ThemeState['colors']>>
    ) {
      state.mode = 'custom';
      state.colors = { ...state.colors, ...action.payload, accent: state.accent };
    },
    setPreset(state, action: PayloadAction<'light' | 'dark' | 'custom'>) {
      if (action.payload === 'custom') {
        state.mode = 'custom';
      } else {
        slice.caseReducers.setMode(state, { type: '', payload: action.payload });
      }
    },
  },
});

export const { setMode, toggleMode, setAccent, setCustomPalette, setPreset } =
  slice.actions;
export default slice.reducer;
