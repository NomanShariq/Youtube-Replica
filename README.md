# YouTube Replica

A YouTube-style video app built with **React Native (Expo)** and **TypeScript**.
One codebase runs on **Android, iOS and Web**.

## Features

- Home feed with full-width auto-playing videos (muted, with mute/unmute button)
- Category chips with explore button
- Shorts shelf with horizontal scrolling
- Community post with like, dislike, share, save and comment actions
- Header with notification badge and search
- Bottom navigation (Home, Shorts, Create, Subscriptions, You)
- Responsive layout, phone-style width on web

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native with Expo |
| Language | TypeScript |
| Navigation | Expo Router |
| Icons | @expo/vector-icons (Ionicons) |
| Video | react-native-youtube-iframe (mobile), YouTube embed iframe (web) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS)
- [Git](https://git-scm.com)
- Expo Go app on your phone (version must match the project's Expo SDK)

### Installation

```bash
git clone https://github.com/NomanShariq/Youtube-Replica.git
cd Youtube-Replica
npm install --legacy-peer-deps
```

### Run

```bash
npx expo start
```

- Press `w` to open in the browser
- Scan the QR code with Expo Go to open on your phone
  (phone and laptop must be on the same network)

## Project Structure

```
src/
  app/
    index.tsx    # Home screen (header, chips, feed, bottom bar)
assets/          # Images and icons
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run web` | Run in the browser |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |

## Notes

- Feed data (videos, Shorts, post) is currently defined inside the app code.
- Shorts and post images are loaded from `picsum.photos`.

## Screenshots

<img width="243" height="531" alt="image" src="https://github.com/user-attachments/assets/f0ddac76-ecd6-4443-9531-a76d91133c41" />
<img width="239" height="527" alt="image" src="https://github.com/user-attachments/assets/c983f1ab-82cd-4852-b5b5-71b715a08a55" />


## Author

Syed Noman Shariq
