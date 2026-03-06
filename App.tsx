import { useEffect, useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider, XStack, YStack, Text } from 'tamagui';

import tamaguiConfig from './tamagui.config';
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
    <XStack backgroundColor="rgba(0,0,0,0.15)" borderRadius={30} padding={4}>
      {(Object.entries(MODES) as [ModeKey, (typeof MODES)[ModeKey]][]).map(([key, m]) => (
        <YStack
          key={key}
          onPress={() => switchMode(key)}
          paddingVertical={8}
          paddingHorizontal={16}
          borderRadius={26}
          backgroundColor={mode === key ? 'rgba(255,255,255,0.25)' : 'transparent'}
        >
          <Text
            color={mode === key ? 'white' : 'rgba(255,255,255,0.7)'}
            fontWeight="600"
            fontSize={14}
          >
            {m.label}
          </Text>
        </YStack>
      ))}
    </XStack>
  );

  // Timer ring uses RN View + inline styles — it's a custom CSS visual, not a layout element
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
        color="white"
        style={{ fontSize: isLandscape ? 44 : 64, fontWeight: '100', letterSpacing: 2 }}
      >
        {pad(minutes)}:{pad(seconds)}
      </Text>
    </View>
  );

  const sessionsText = (
    <Text color="rgba(255,255,255,0.8)" fontSize={16} fontWeight="500">
      {sessions} session{sessions !== 1 ? 's' : ''} completed
    </Text>
  );

  const buttons = (
    <XStack gap={16} alignItems="center">
      <YStack
        onPress={reset}
        borderRadius={50}
        paddingVertical={16}
        paddingHorizontal={24}
        borderWidth={2}
        borderColor="rgba(255,255,255,0.6)"
      >
        <Text color="rgba(255,255,255,0.9)" fontWeight="600" fontSize={16}>
          Reset
        </Text>
      </YStack>
      <YStack
        onPress={toggleTimer}
        backgroundColor="white"
        borderRadius={50}
        paddingVertical={16}
        paddingHorizontal={48}
        elevation={6}
      >
        <Text color="#333333" fontWeight="700" fontSize={18}>
          {running ? 'Pause' : secondsLeft === 0 ? 'Restart' : 'Start'}
        </Text>
      </YStack>
    </XStack>
  );

  const portrait = (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="space-evenly"
      paddingTop={60}
      paddingBottom={40}
      backgroundColor={current.color}
    >
      <StatusBar style="light" />
      {modeTabs}
      {timerRing}
      {sessionsText}
      {buttons}
    </YStack>
  );

  const landscape = (
    <XStack flex={1} backgroundColor={current.color}>
      <StatusBar style="light" hidden />
      <YStack flex={1} alignItems="center" justifyContent="center">
        {timerRing}
      </YStack>
      <YStack flex={1} alignItems="center" justifyContent="space-evenly" paddingVertical={16}>
        {modeTabs}
        {sessionsText}
        {buttons}
      </YStack>
    </XStack>
  );

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      {isLandscape ? landscape : portrait}
    </TamaguiProvider>
  );
}
