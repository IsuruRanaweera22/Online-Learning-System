// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBc9Arbl0KJGYndzRTn3SDKMgyFxe_Uw-g",
    authDomain: "online-learning-platform-3605e.firebaseapp.com",
    projectId: "online-learning-platform-3605e",
    storageBucket: "online-learning-platform-3605e.appspot.com", // Corrected storage bucket
    messagingSenderId: "905974584882",
    appId: "1:905974584882:web:f26ea6adc7d6d050014e2b",
    measurementId: "G-3H4NTFE352"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app); // Export Firestore instance
