import './global.css';

import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useTimerStore, MODES, ModeKey } from './store/timerStore';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export default function App() {
  const { mode, secondsLeft, running, sessions, switchMode, toggleTimer, reset, tick } =
    useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = MODES[mode];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = secondsLeft / current.duration;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return (
    <View
      className="flex-1 items-center justify-evenly pt-16 pb-10"
      style={{ backgroundColor: current.color }}
    >
      <StatusBar style="light" />

      {/* Mode tabs */}
      <View className="flex-row bg-black/15 rounded-full p-1">
        {(Object.entries(MODES) as [ModeKey, (typeof MODES)[ModeKey]][]).map(([key, m]) => (
          <Pressable
            key={key}
            onPress={() => switchMode(key)}
            className={`py-2 px-4 rounded-full ${mode === key ? 'bg-white/25' : ''}`}
          >
            <Text
              className={`font-semibold text-sm ${mode === key ? 'text-white' : 'text-white/70'}`}
            >
              {m.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Timer ring */}
      <View className="items-center justify-center">
        <View
          className="w-60 h-60 rounded-full border-[12px] items-center justify-center overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.3)' }}
        >
          <View
            className="absolute w-60 h-60 rounded-full border-[12px] border-t-transparent border-r-transparent border-b-transparent"
            style={{
              borderColor: 'white',
              transform: [{ rotate: `${(1 - progress) * 360}deg` }],
            }}
          />
          <Text className="text-7xl font-thin text-white tracking-widest">
            {pad(minutes)}:{pad(seconds)}
          </Text>
        </View>
      </View>

      {/* Sessions */}
      <Text className="text-white/80 text-base font-medium">
        {sessions} session{sessions !== 1 ? 's' : ''} completed
      </Text>

      {/* Buttons */}
      <View className="flex-row gap-4 items-center">
        <Pressable
          onPress={reset}
          className="rounded-full py-4 px-6 border-2 border-white/60"
        >
          <Text className="text-base font-semibold text-white/90">Reset</Text>
        </Pressable>
        <Pressable
          onPress={toggleTimer}
          className="bg-white rounded-full py-4 px-12"
          style={{ elevation: 6 }}
        >
          <Text className="text-lg font-bold text-[#333]">
            {running ? 'Pause' : secondsLeft === 0 ? 'Restart' : 'Start'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
