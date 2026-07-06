import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True when the required public Firebase config is present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

// When keys are absent (local dev / CI build), fall back to a harmless
// placeholder so getAuth()/getFirestore() don't throw at import/prerender time.
// All real Firebase calls are guarded by `isFirebaseConfigured`, so nothing
// actually talks to this placeholder project.
const placeholder: FirebaseOptions = {
  apiKey: "not-configured",
  authDomain: "not-configured.firebaseapp.com",
  projectId: "not-configured",
};

// Initialize once (Next.js may evaluate this module multiple times).
const app = getApps().length
  ? getApp()
  : initializeApp(isFirebaseConfigured ? firebaseConfig : placeholder);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
