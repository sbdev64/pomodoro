import { create } from 'zustand';
import { Vibration } from 'react-native';

export type ModeKey = 'work' | 'short' | 'long';

export interface ModeConfig {
  label: string;
  duration: number;
  color: string;
}

export const MODES: Record<ModeKey, ModeConfig> = {
  work:  { label: 'Focus',       duration: 25 * 60, color: '#E53935' },
  short: { label: 'Short Break', duration:  5 * 60, color: '#43A047' },
  long:  { label: 'Long Break',  duration: 15 * 60, color: '#1E88E5' },
};

interface TimerState {
  mode: ModeKey;
  secondsLeft: number;
  running: boolean;
  sessions: number;
  switchMode: (mode: ModeKey) => void;
  toggleTimer: () => void;
  reset: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'work',
  secondsLeft: MODES.work.duration,
  running: false,
  sessions: 0,

  switchMode: (next) =>
    set({ mode: next, secondsLeft: MODES[next].duration, running: false }),

  toggleTimer: () => {
    const { secondsLeft, running, mode } = get();
    if (secondsLeft === 0) {
      set({ secondsLeft: MODES[mode].duration, running: true });
    } else {
      set({ running: !running });
    }
  },

  reset: () => {
    const { mode } = get();
    set({ running: false, secondsLeft: MODES[mode].duration });
  },

  tick: () => {
    const { secondsLeft, mode, sessions } = get();
    if (secondsLeft <= 1) {
      Vibration.vibrate([0, 500, 200, 500]);
      set({
        secondsLeft: 0,
        running: false,
        sessions: mode === 'work' ? sessions + 1 : sessions,
      });
    } else {
      set({ secondsLeft: secondsLeft - 1 });
    }
  },
}));
