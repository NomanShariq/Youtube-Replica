# YouTube Replica

A cross-platform YouTube clone built with **React Native (Expo)** and **TypeScript**.
One codebase runs on **Android, iOS and Web**.

> Course: Mobile Application Development, Iqra University

## Features

- Home feed with video thumbnails
- Video player
- Search
- Channel pages
- Likes and comments
- [Add or remove features as per your project]

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native (Expo SDK 58) |
| Language | TypeScript |
| Navigation | Expo Router |
| State | Zustand |
| Backend | [Supabase / Firebase / Dummy data] |
| Web | React Native Web |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS)
- [Git](https://git-scm.com)
- Expo Go app on your phone (SDK 58 version)

### Installation

```bash
git clone https://github.com/NomanShariq/Youtube-Replica.git
cd Youtube-Replica
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

### Run the App

```bash
npx expo start
```

- Press `w` to open in the browser
- Scan the QR code with Expo Go to open on your phone
  (phone and laptop must be on the same network)

## Project Structure

```
src/
  app/          # Screens and routes (Expo Router)
  components/   # Reusable UI components
  lib/          # API / Supabase client
  store/        # Global state
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run web` | Run in the browser |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |

## Team

| Name | Student ID | Role |
|------|-----------|------|
| [Name] | [ID] | [Role] |

**Instructor:** [Instructor name]

## Screenshots

_Add screenshots here._

## License

This project is for educational purposes.
