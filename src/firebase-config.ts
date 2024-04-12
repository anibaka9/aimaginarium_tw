// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVAlN6y_aF9xFSg9ZT3jViXiN123ZQ5nk",
  authDomain: "aimaginarium-92019.firebaseapp.com",
  projectId: "aimaginarium-92019",
  storageBucket: "aimaginarium-92019.appspot.com",
  messagingSenderId: "804891220788",
  appId: "1:804891220788:web:e1735effd20f4d57b6e361",
  measurementId: "G-MP7M6H0WBL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
