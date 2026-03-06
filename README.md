# Pomodoro

A simple Pomodoro timer built with React Native, Expo, TypeScript, Tamagui, and Zustand.

## Features

- Three timer modes: **Focus** (25 min), **Short Break** (5 min), **Long Break** (15 min)
- Start, pause, and reset controls
- Vibration alert when a timer finishes
- Session counter tracking completed focus sessions
- Color-coded UI per mode (red / green / blue)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+) — on Ubuntu WSL, install via nvm (see below)
- [Expo Go](https://expo.dev/go) app on your phone, or an Android/iOS simulator

## Install

```bash
cd pomodoro
npm install --legacy-peer-deps
```

> **Note:** `--legacy-peer-deps` is required due to peer dependency constraints between expo 52, react 18.3.1, and react-native 0.76.7.

## Run

```bash
npx expo start
```

Then:
- **Phone:** scan the QR code with Expo Go (Android) or the Camera app (iOS)
- **Android emulator:** press `a`
- **iOS simulator:** press `i`
- **Web browser:** press `w`

---

## Running on Ubuntu WSL

By default, Ubuntu WSL may resolve `npx` to the Windows Node.js installation, which causes this error:

```
npm error code ERR_INVALID_URL
npm error Invalid URL
```

The fix is to install Linux Node.js via **nvm** so WSL uses its own `npx`.

### 1. Install nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
```

Restart your terminal (or `source ~/.zshrc`) so nvm is available.

### 2. Install Node 18

```bash
nvm install 18
```

Verify:

```bash
which npx   # should be ~/.nvm/versions/node/v18.x.x/bin/npx, NOT /mnt/c/...
```

### 3. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 4. Run the app

**Web browser (easiest for WSL):**

```bash
npx expo start --web
```

Open **http://localhost:8081** in your Windows browser — WSL2 forwards `localhost` automatically.

**Phone via Expo Go — tunnel mode (required for WSL2):**

Default LAN mode doesn't work in WSL2 because the phone can't reach the WSL2 network interface. Use `--tunnel` instead, which routes traffic through a public ngrok URL:

```bash
npx expo start --tunnel
```

Scan the QR code with Expo Go. Requires `@expo/ngrok` (already in dependencies) and an internet connection.

---

## Project Structure

```
pomodoro/
├── App.tsx               # Root component — layout and timer UI
├── store/
│   └── timerStore.ts     # Zustand store — all timer state and actions
├── tamagui.config.ts     # Tamagui theme/token configuration
├── metro.config.js       # Metro bundler configuration
├── tsconfig.json         # TypeScript configuration
├── app.json              # Expo configuration
├── babel.config.js       # Babel preset for Expo + Tamagui
└── package.json
```

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| expo | ~52.0.49 | Expo SDK and CLI |
| react | 18.3.1 | UI library |
| react-native | 0.76.9 | Native runtime |
| expo-status-bar | ~2.0.0 | Status bar control |
| tamagui | ^2.0.0-rc | UI component library and style system |
| @tamagui/config | ^2.0.0-rc | Default Tamagui theme and tokens |
| @tamagui/babel-plugin | ^2.0.0-rc | Babel plugin for static extraction |
| zustand | ^5.0.0 | Lightweight state management |
| react-native-web | ~0.19.13 | Web support |
| react-dom | 18.3.1 | Web rendering |
| @expo/metro-runtime | ~4.0.1 | Metro runtime for web |
| @expo/ngrok | ^4.1.3 | Tunnel support for WSL/remote |
