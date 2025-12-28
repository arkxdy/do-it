# Do-it - Task Manager App

A simple, elegant, and efficient task management app built with React Native and Expo. Manage your daily and persistent tasks with ease, track your progress, and build productive habits.

## Features

- 📅 **Daily Tasks** - Tasks that reset every day at 00:00 (but remain uncompleted, not deleted)
- ✅ **Persistent Tasks** - Tasks that stay until you manually delete them
- 📊 **Statistics Dashboard** - Track your completion rate and view weekly progress
- 📜 **Task History** - Complete history of finished tasks with timestamps
- 🎨 **Minimalist Design** - Pure black and white theme optimized for mobile
- 💾 **Local Storage** - All data saved locally on your device
- 📱 **Mobile-First** - Built with Expo for iOS and Android

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development framework and build tools
- **TypeScript** - Type-safe development
- **AsyncStorage** - Local data persistence
- **Lucide React Native** - Beautiful icons
- **React Native Safe Area Context** - Handle notches and safe areas

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/do-it.git
cd do-it
```

2. Install dependencies
```bash
npm install
```

3. Install required packages
```bash
npm install @react-native-async-storage/async-storage
npm install react-native-safe-area-context
npm install expo-status-bar
```

4. Start the development server
```bash
expo start
```

5. Run on your device
- **iOS**: Press `i` to open in iOS Simulator
- **Android**: Press `a` to open in Android Emulator
- **Mobile**: Scan QR code with Expo Go app

## Usage

### Adding Tasks

1. Tap the **+** button in the header
2. Enter your task description
3. Choose task type:
   - **Daily**: Resets to uncompleted state every day
   - **Tasks**: Persistent until manually deleted
4. Tap **Add** to create the task

### Managing Tasks

- **Check off**: Tap the checkbox to mark as in-progress
- **Complete**: Tap **Done** to move to history
- **Delete**: Swipe or tap the trash icon to remove
- **Toggle View**: Switch between Daily and Tasks tabs

### Tracking Progress

- **Stats Tab**: View total tasks, completed today, and overall statistics
- **Chart**: 7-day completion history with visual bars
- **History Tab**: Review all completed tasks with timestamps

## Project Structure

```
do-it/
├── app/
│   └── (main app file)
├── types/
│   └── (TypeScript interfaces)
├── components/
│   ├── TaskItem.tsx
│   └── HistoryItem.tsx
├── app.json
├── package.json
├── README.md
├── CONTRIBUTING.md
└── CODE_OF_CONDUCT.md
```

## API Reference

### Task Interface
```typescript
interface Task {
  id: number;
  text: string;
  type: 'daily' | 'global';
  completed: boolean;
  createdAt: string;
}
```

### HistoryEntry Interface
```typescript
interface HistoryEntry {
  id: number;
  taskId: number;
  taskText: string;
  taskType: 'daily' | 'global';
  completedDate: string;
}
```

## Storage

All data is stored locally using AsyncStorage:
- `tasks` - Array of task objects
- `history` - Array of completed tasks
- `lastReset` - Date of last daily reset

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Troubleshooting

### Keyboard Hidden in Modal
The app uses `KeyboardAvoidingView` to ensure input fields remain visible when typing.

### Daily Tasks Not Resetting
Check that the system date has changed. Reset logic triggers at 00:00 each day.

### Data Loss
Data persists in AsyncStorage. If app is uninstalled, local data is lost. Consider implementing cloud backup.

## Future Enhancements

- 🌐 Cloud sync with authentication
- 🔔 Push notifications for reminders
- 🏷️ Task categories and tags
- 🎯 Goal tracking and streaks
- 🌙 Dark/Light theme toggle
- 🔄 Task recurring patterns

## Contributing

We love contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Code of Conduct

Please read our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) to understand our community standards.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- 📧 Email: support@do-it.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/do-it/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/do-it/discussions)

## Changelog

### Version 1.0.0 (Current)
- Initial release
- Daily and persistent task management
- Statistics dashboard
- Task history tracking
- Local data persistence

---

Made with ❤️ by the Do-it Team