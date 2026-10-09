import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBWB2z1yxQFxdwj6BKmbSjfM_sFPAcn9Rg",
  authDomain: "rang-gurukul.firebaseapp.com",
  projectId: "rang-gurukul",
  storageBucket: "rang-gurukul.firebasestorage.app",
  messagingSenderId: "355515858419",
  appId: "1:355515858419:web:ec10cc9f014508dbd52686",
  measurementId: "G-5PZ62HVWEG"
};

// Initialize Firebase singleton
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Storage for cloud photo uploads
export const storage = getStorage(firebaseApp);

// Cloud Firestore Database
export const firestore = getFirestore(firebaseApp);

// Authentication
export const auth = getAuth(firebaseApp);

// Analytics (safely initialized in supported browser environments)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(firebaseApp);
    }
  }).catch(() => {
    // Non-blocking fallback if analytics cannot initialize (e.g. adblocker)
  });
}
