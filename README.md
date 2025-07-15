# 📱 WhatsApp Clone - React Native Push Notification App

A React Native application that demonstrates real-time push notifications similar to WhatsApp, built as an internship assignment.

## 🎯 Features

### ✅ Core Requirements (Completed)
- ✅ **React Native App** with minimal UI
- ✅ **Real-time Push Notifications** using Firebase Cloud Messaging (FCM)
- ✅ **Background/Killed State Support** - notifications work even when app is closed
- ✅ **Native Android Module** built with Kotlin for notification handling
- ✅ **WhatsApp-style Notifications** with heads-up display, sound, and vibration
- ✅ **Deep Linking** - tapping notifications opens specific screens
- ✅ **Local Notification Storage** with badge counts
- ✅ **Backend Simulation** for testing notifications

### 🚀 Bonus Features (Implemented)
- ✅ **Badge Counts** - shows unread notification count
- ✅ **Deep Linking** - notifications navigate to specific screens
- ✅ **Local Storage** - notifications persist between app sessions
- ✅ **Backend API** - Node.js server to trigger test notifications
- ✅ **Voice/Video Call Simulation** - WhatsApp-style call notifications

## 🛠️ Technologies Used

- **React Native** (0.73.0)
- **Firebase Cloud Messaging** (FCM)
- **Kotlin** (Native Android module)
- **TypeScript**
- **AsyncStorage** (Local storage)
- **Node.js** (Backend simulation)
- **Express.js** (Backend API)

## 📋 Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio
- Android SDK
- Firebase Project

## 🚀 Setup Instructions

### 1. Firebase Setup

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Add Android app with package name: `com.whatsappclone`

2. **Download Configuration:**
   - Download `google-services.json`
   - Place it in `android/app/` directory

3. **Get Service Account Key (for backend):**
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebase-service-account.json` in project root

### 2. Install Dependencies

```bash
# Navigate to project directory
cd WhatsAppClone

# Install React Native dependencies
npm install

# Install backend dependencies
npm install firebase-admin express cors
```

### 3. Run the Application

#### Option A: Physical Device
1. Enable USB debugging on your Android device
2. Connect device to computer
3. Run the app:
```bash
npx react-native run-android
```

#### Option B: Android Emulator
1. Open Android Studio
2. Launch an emulator
3. Run the app:
```bash
npx react-native run-android
```

### 4. Start Backend Server (Optional)

```bash
# Start the backend simulation server
node backend-simulation.js
```

## 🧪 Testing Notifications

### Method 1: In-App Testing
1. Open the app
2. Tap "Send Test Notification" button
3. Check the Notifications tab

### Method 2: Backend API Testing
1. Start the backend server: `node backend-simulation.js`
2. Copy FCM token from app logs
3. Register token with backend:
```bash
curl -X POST http://localhost:3000/register-token \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_FCM_TOKEN"}'
```

4. Send test notification:
```bash
curl -X POST http://localhost:3000/test-message
```

### Method 3: Firebase Console
1. Go to Firebase Console > Cloud Messaging
2. Send test message to your device

## 📱 App Features

### Home Screen
- Welcome message and app description
- Test notification button
- Feature list

### Notifications Screen
- List of all received notifications
- Read/unread status indicators
- Timestamp display
- Clear all functionality

### Chat Screen
- Placeholder for chat interface
- Demonstrates deep linking from notifications

## 🔧 Project Structure

```
WhatsAppClone/
├── android/
│   └── app/src/main/java/com/whatsappclone/
│       ├── MainActivity.kt
│       ├── MainApplication.kt
│       └── NotificationService.kt          # Kotlin native module
├── src/
│   └── components/
│       ├── NotificationHandler.tsx         # FCM handling
│       └── NotificationList.tsx            # UI component
├── App.tsx                                # Main app component
├── backend-simulation.js                   # Test server
└── README.md
```

## 🔍 Key Components

### Kotlin Native Module (`NotificationService.kt`)
- Handles FCM messages in background/killed state
- Creates WhatsApp-style notifications
- Manages notification channels
- Updates badge counts

### React Native Components
- **NotificationHandler**: Manages FCM tokens and message handling
- **NotificationList**: Displays notifications with read/unread states
- **App.tsx**: Main UI with navigation and test functionality

### Backend Simulation
- Express.js server for testing
- FCM token registration
- Test notification endpoints
- Voice/video call simulation

## 🎯 Assignment Requirements Met

1. ✅ **Basic React Native App** - Minimal UI with modern design
2. ✅ **Push Notifications** - FCM integration with background support
3. ✅ **Native Module** - Kotlin implementation for Android
4. ✅ **WhatsApp-style Notifications** - Heads-up, sound, vibration
5. ✅ **Deep Linking** - Navigation to specific screens
6. ✅ **Badge Counts** - Unread notification tracking
7. ✅ **Backend Simulation** - Node.js server for testing

## 🐛 Troubleshooting

### Common Issues

1. **"adb not recognized"**
   - Add Android SDK platform-tools to PATH
   - Restart terminal

2. **Firebase not working**
   - Verify `google-services.json` is in correct location
   - Check Firebase project configuration

3. **Notifications not showing**
   - Ensure app has notification permissions
   - Check FCM token is generated
   - Verify backend server is running

4. **Build errors**
   - Clean and rebuild: `cd android && ./gradlew clean`
   - Reset Metro: `npx react-native start --reset-cache`

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all setup steps are completed
3. Check Firebase Console for configuration issues

## 🎉 Success Criteria

The app successfully demonstrates:
- ✅ Real-time push notifications
- ✅ Background/killed state handling
- ✅ Native Android module implementation
- ✅ WhatsApp-style notification UI
- ✅ Deep linking functionality
- ✅ Local storage and badge counts
- ✅ Backend integration for testing

---

**Built with ❤️ for React Native Internship Assignment**
