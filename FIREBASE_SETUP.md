# Firebase Setup Instructions

To enable cross-browser synchronization for your Task Tracker app, you need to set up Firebase Firestore.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter a project name
   - (Optional) Enable Google Analytics
   - Click "Create project"

## Step 2: Create a Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development) or set up security rules
4. Select a location for your database
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Register your app with a nickname (e.g., "Task Tracker")
6. Copy the `firebaseConfig` object

## Step 4: Update Firebase Configuration

1. Open `src/app/config/firebase.config.ts`
2. Replace the placeholder values with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Set Up Firestore Security Rules (Important!)

1. In Firebase Console, go to "Firestore Database" → "Rules"
2. Update the rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if true; // For development - allows all access
      // For production, implement proper authentication rules
    }
  }
}
```

3. Click "Publish"

**Note:** The rule above allows anyone to read/write. For production, implement proper authentication and security rules.

## Step 6: Deploy Your App

After updating the Firebase config, commit and push your changes:

```bash
git add .
git commit -m "Configure Firebase for cross-browser sync"
git push
```

## How It Works

- **With Firebase configured**: Tasks are stored in Firestore and synchronized in real-time across all browsers/devices
- **Without Firebase**: Tasks are stored in localStorage (browser-specific, no cross-browser sync)

## Testing

1. Open your app in two different browsers
2. Create a task in one browser
3. The task should appear automatically in the other browser (no refresh needed!)

## Troubleshooting

- **Tasks not syncing**: Check browser console for Firebase errors
- **"Firebase not configured" message**: Verify your config values in `firebase.config.ts`
- **Permission errors**: Check your Firestore security rules

## Free Tier Limits

Firebase offers a generous free tier:
- 50K reads/day
- 20K writes/day
- 20K deletes/day
- 1 GB storage

This should be more than enough for personal use!

