import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration
// These values should be set in your environment variables (.env.local)
// NEVER commit .env.local to version control!
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

// Validate environment variables (only warn, don't block)
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  if (typeof window !== 'undefined') {
    // Client-side: use console.warn instead of error
    console.warn(
      '⚠️ Missing Firebase environment variables:',
      missingVars.join(', ')
    );
    console.warn('Please restart the dev server after creating/updating .env.local');
  } else {
    // Server-side: can use console.error
    console.error(
      'Missing required Firebase environment variables:',
      missingVars.join(', ')
    );
    console.error('Please create a .env.local file with your Firebase configuration.');
  }
}

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  // Client-side initialization
  try {
    if (!getApps().length) {
      // Only initialize if we have the minimum required config
      if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
      } else {
        // Create a dummy app to satisfy TypeScript, but it won't work
        throw new Error('Firebase not initialized: Missing required configuration');
      }
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    auth = getAuth(app);

    // Initialize Analytics only on client side and if supported
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {
      // Analytics not supported or failed to initialize
      analytics = null;
    });
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    // Re-throw to prevent app from running with uninitialized Firebase
    throw error;
  }
} else {
  // Server-side initialization
  try {
    if (!getApps().length) {
      if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
      } else {
        throw new Error('Firebase not initialized: Missing required configuration');
      }
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error('Failed to initialize Firebase on server:', error);
    // Re-throw to prevent app from running with uninitialized Firebase
    throw error;
  }
  // Analytics is not available on server side
}

export { app, db, auth, analytics };
