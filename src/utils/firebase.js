// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOw07miN4pRUfxFBGtEjH_SWPQFerBrAI",
  authDomain: "e-commercereact-92c33.firebaseapp.com",
  projectId: "e-commercereact-92c33",
  storageBucket: "e-commercereact-92c33.firebasestorage.app",
  messagingSenderId: "26615165153",
  appId: "1:26615165153:web:d21baf552b02557ad847a0",
  measurementId: "G-PTMWSN9SBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);