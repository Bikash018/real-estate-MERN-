// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-61e5f.firebaseapp.com",
  projectId: "mern-estate-61e5f",
  storageBucket: "mern-estate-61e5f.appspot.com",
  messagingSenderId: "521966200082",
  appId: "1:521966200082:web:438ef7a64c51b50641ffcb",
  measurementId: "G-672WT05K3R"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
