import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCTsjqfWC6BtsHN3nZEnyD7KW5oEX9DxdE",
  authDomain: "doctor-finder-c2ed4.firebaseapp.com",
  projectId: "doctor-finder-c2ed4",
  storageBucket: "doctor-finder-c2ed4.firebasestorage.app",
  messagingSenderId: "679662711891",
  appId: "1:679662711891:web:361308046f73b8965242a6",
  measurementId: "G-17SBJ1Y7TZ"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
