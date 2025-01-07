// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_kU-CGlW92XKhcdJKRBwwNbB7u7kntjI",
    authDomain: "uangmu1-4de91.firebaseapp.com",
    projectId: "uangmu1-4de91",
    storageBucket: "uangmu1-4de91.firebasestorage.app",
    messagingSenderId: "16929485804",
    appId: "1:16929485804:web:91c3b5e03e1f62711f86c9",
    measurementId: "G-QZTR5BCH0H"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
