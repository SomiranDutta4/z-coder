// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjZ1tbKIZWev73zQYh1iDQrwsucj5puUk",
  authDomain: "z-coder-61203.firebaseapp.com",
  projectId: "z-coder-61203",
  storageBucket: "z-coder-61203.firebasestorage.app",
  messagingSenderId: "318521835264",
  appId: "1:318521835264:web:3c15c00c7c76c772c4bde5",
  measurementId: "G-E7PJWF24Q7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
