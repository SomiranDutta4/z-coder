// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBW70ki2UKYPuAFO2KjMgR5DRvJE2Mf5BQ",
    authDomain: "zcoder-126bf.firebaseapp.com",
    projectId: "zcoder-126bf",
    storageBucket: "zcoder-126bf.appspot.com",
    messagingSenderId: "1032059240900",
    appId: "1:1032059240900:web:0d1cd6a9848a0d34a32491"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();