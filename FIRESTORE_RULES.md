# Firebase Security Rules for Adventure Tracker

## Quick Setup (Development)

### 1. Firestore Database Rules

Copy and paste these rules into your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Adventures collection - allow all read/write for development
    match /adventures/{adventureId} {
      allow read, write: if true;
    }
    
    // Surprises collection - allow all read/write for development
    match /surprises/{surpriseId} {
      allow read, write: if true;
    }
    
    // Achievements collection - allow all read/write for development
    match /achievements/{achievementId} {
      allow read, write: if true;
    }
  }
}
```

### 2. Firebase Storage Rules

Copy and paste these rules into your Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to adventure photos
    match /adventures/{adventureId}/{allPaths=**} {
      allow read, write: if true;
    }
    
    // Allow read/write access to surprise photos
    match /surprises/{surpriseId}/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## How to Apply

### Firestore Rules:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **task-def96**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the Firestore rules above
6. Click **Publish**

### Storage Rules:
1. In the same Firebase Console
2. Click on **Storage** in the left sidebar
3. Click on the **Rules** tab
4. Replace the existing rules with the Storage rules above
5. Click **Publish**

## Production Rules (Recommended for later)

For production, you should implement authentication and restrict access:

### Firestore Rules (Production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write adventures
    match /adventures/{adventureId} {
      allow read, write: if request.auth != null;
    }
    
    // Only authenticated users can read/write surprises
    match /surprises/{surpriseId} {
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

### Storage Rules (Production):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Only authenticated users can access adventure photos
    match /adventures/{adventureId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Only authenticated users can access surprise photos
    match /surprises/{surpriseId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Current Project Info

- **Project ID**: task-def96
- **Firestore Collections Used**:
  - `adventures` - Stores all adventure items
  - `surprises` - Stores all surprise items (separate from adventures)
  - `achievements` - Stores achievement data (optional)
- **Storage Folders Used**:
  - `adventures/{adventureId}/` - Stores photos for adventures
  - `surprises/{surpriseId}/` - Stores photos for surprises

## Troubleshooting

If you still see permission errors after updating rules:
1. Make sure you clicked **Publish** after updating rules
2. Wait a few seconds for rules to propagate
3. Refresh your app
4. Check the browser console for specific error messages

