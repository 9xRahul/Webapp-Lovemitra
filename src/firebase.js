import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

// Web app's Firebase configuration
// Using same project details as the Flutter app
const firebaseConfig = {
  apiKey: "AIzaSyDDRPUcI5TdZpav_7q9NqMJMEt2jyBhqR8",
  authDomain: "lovemitra-app-2026.firebaseapp.com",
  projectId: "lovemitra-app-2026",
  storageBucket: "lovemitra-app-2026.firebasestorage.app",
  messagingSenderId: "979103719502",
  appId: "1:979103719502:web:placeholder", // Needs web app ID if you use specific analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Messaging may fail if not supported in the browser or missing vapid key, so we handle it cautiously
export let messaging;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.log(
    "Firebase Messaging not supported or failed to initialize",
    error,
  );
}
