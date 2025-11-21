import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnUFuTSScP6iV2r3-1E4FK6wg140vhkJs",
  authDomain: "task-def96.firebaseapp.com",
  projectId: "task-def96",
  storageBucket: "task-def96.firebasestorage.app",
  messagingSenderId: "989576119788",
  appId: "1:989576119788:web:d2fe11e8da2209ba0eacc9",
  measurementId: "G-3N838EPF89"
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY" && 
         firebaseConfig.projectId !== "YOUR_PROJECT_ID" &&
         firebaseConfig.apiKey.length > 0;
};

// Initialize Firebase
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export { db };

