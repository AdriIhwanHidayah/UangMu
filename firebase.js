import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAz7j1nQue2ly5Bdg3UK-GXtluvL6DNWxY",
  authDomain: "uangmu-af666.firebaseapp.com",
  projectId: "uangmu-af666",
  storageBucket: "uangmu-af666.firebasestorage.app",
  messagingSenderId: "171105649986",
  appId: "1:171105649986:web:d7222ea1296a60d0f4f4db",
  measurementId: "G-06DQ93YRR0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore instance
const analytics = getAnalytics(app);

export { db, analytics };
