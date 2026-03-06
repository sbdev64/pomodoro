import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Vibration } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const MODES = {
  work: { label: 'Focus', duration: 25 * 60, color: '#E53935' },
  short: { label: 'Short Break', duration: 5 * 60, color: '#43A047' },
  long: { label: 'Long Break', duration: 15 * 60, color: '#1E88E5' },
};

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function App() {
  const [mode, setMode] = useState('work');
  const [secondsLeft, setSecondsLeft] = useState(MODES.work.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const current = MODES[mode];

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            Vibration.vibrate([0, 500, 200, 500]);
            setRunning(false);
            if (mode === 'work') setSessions((n) => n + 1);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  function switchMode(next) {
    setRunning(false);
    setMode(next);
    setSecondsLeft(MODES[next].duration);
  }

  function toggleTimer() {
    if (secondsLeft === 0) {
      setSecondsLeft(current.duration);
      setRunning(true);
    } else {
      setRunning((r) => !r);
    }
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(current.duration);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = secondsLeft / current.duration;

  return (
    <View style={[styles.container, { backgroundColor: current.color }]}>
      <StatusBar style="light" />

      {/* Mode tabs */}
      <View style={styles.tabs}>
        {Object.entries(MODES).map(([key, m]) => (
          <Pressable
            key={key}
            onPress={() => switchMode(key)}
            style={[styles.tab, mode === key && styles.tabActive]}
          >
            <Text style={[styles.tabText, mode === key && styles.tabTextActive]}>
              {m.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Timer ring */}
      <View style={styles.ringContainer}>
        <View style={[styles.ring, { borderColor: 'rgba(255,255,255,0.3)' }]}>
          <View
            style={[
              styles.ringFill,
              {
                borderColor: 'white',
                transform: [{ rotate: `${(1 - progress) * 360}deg` }],
              },
            ]}
          />
          <Text style={styles.timerText}>
            {pad(minutes)}:{pad(seconds)}
          </Text>
        </View>
      </View>

      {/* Sessions */}
      <Text style={styles.sessions}>
        {sessions} session{sessions !== 1 ? 's' : ''} completed
      </Text>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Pressable onPress={reset} style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Reset</Text>
        </Pressable>
        <Pressable onPress={toggleTimer} style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>
            {running ? 'Pause' : secondsLeft === 0 ? 'Restart' : 'Start'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 60,
    paddingBottom: 40,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 30,
    padding: 4,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 26,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: 'white',
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ringFill: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 12,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timerText: {
    fontSize: 64,
    fontWeight: '200',
    color: 'white',
    letterSpacing: 2,
  },
  sessions: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: 'white',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  btnPrimaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  btnSecondary: {
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
});
