import './global.css';

import { useEffect, useRef } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { useTimerStore, MODES, ModeKey } from './store/timerStore';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export default function App() {
  const { mode, secondsLeft, running, sessions, switchMode, toggleTimer, reset, tick } =
    useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const current = MODES[mode];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = secondsLeft / current.duration;

  // Scale ring down in landscape so it fits the reduced vertical space
  const ringSize = isLandscape ? 176 : 240;
  const ringBorder = isLandscape ? 10 : 12;

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

  const modeTabs = (
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
  );

  const timerRing = (
    <View
      style={{
        width: ringSize,
        height: ringSize,
        borderRadius: ringSize / 2,
        borderWidth: ringBorder,
        borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: ringSize,
          height: ringSize,
          borderRadius: ringSize / 2,
          borderWidth: ringBorder,
          borderTopColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: 'white',
          transform: [{ rotate: `${(1 - progress) * 360}deg` }],
        }}
      />
      <Text
        style={{
          fontSize: isLandscape ? 44 : 64,
          fontWeight: '100',
          color: 'white',
          letterSpacing: 2,
        }}
      >
        {pad(minutes)}:{pad(seconds)}
      </Text>
    </View>
  );

  const sessionsText = (
    <Text className="text-white/80 text-base font-medium">
      {sessions} session{sessions !== 1 ? 's' : ''} completed
    </Text>
  );

  const buttons = (
    <View className="flex-row gap-4 items-center">
      <Pressable onPress={reset} className="rounded-full py-4 px-6 border-2 border-white/60">
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
  );

  if (isLandscape) {
    return (
      <View className="flex-1 flex-row" style={{ backgroundColor: current.color }}>
        <StatusBar style="light" hidden />
        {/* Left: timer ring */}
        <View className="flex-1 items-center justify-center">
          {timerRing}
        </View>
        {/* Right: mode tabs + sessions + buttons */}
        <View className="flex-1 items-center justify-evenly py-4">
          {modeTabs}
          {sessionsText}
          {buttons}
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-1 items-center justify-evenly pt-16 pb-10"
      style={{ backgroundColor: current.color }}
    >
      <StatusBar style="light" />
      {modeTabs}
      {timerRing}
      {sessionsText}
      {buttons}
    </View>
  );
}
