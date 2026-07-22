import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAMp_IFZTPakMA6zrtA5peWut6y_z13kp4",
  authDomain: "kavach-ai-6fc8d.firebaseapp.com",
  projectId: "kavach-ai-6fc8d",
  storageBucket: "kavach-ai-6fc8d.firebasestorage.app",
  messagingSenderId: "695330342080",
  appId: "1:695330342080:web:cf108e50de791edb061925",
  measurementId: "G-NW8B8WK11W"
};

// Initialize Firebase client instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
