# Firestore Security Rules for Adventure Tracker

## Quick Setup (Development)

Copy and paste these rules into your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Adventures collection - allow all read/write for development
    match /adventures/{adventureId} {
      allow read, write: if true;
    }
    
    // Achievements collection - allow all read/write for development
    match /achievements/{achievementId} {
      allow read, write: if true;
    }
  }
}
```

## How to Apply

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **task-def96**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the rules above
6. Click **Publish**

## Production Rules (Recommended for later)

For production, you should implement authentication and restrict access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write adventures
    match /adventures/{adventureId} {
      allow read, write: if request.auth != null;
    }
    
    // Achievements are read-only for authenticated users
    match /achievements/{achievementId} {
      allow read: if request.auth != null;
      allow write: if false; // Achievements are managed server-side
    }
  }
}
```

## Current Project Info

- **Project ID**: task-def96
- **Collections Used**:
  - `adventures` - Stores all adventure items
  - `achievements` - Stores achievement data (optional)

## Troubleshooting

If you still see permission errors after updating rules:
1. Make sure you clicked **Publish** after updating rules
2. Wait a few seconds for rules to propagate
3. Refresh your app
4. Check the browser console for specific error messages

