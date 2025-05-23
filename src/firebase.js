// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpYwMTGXiRYgK8INYqiX5uLanfPGvyFZE",
  authDomain: "lithilexicon.firebaseapp.com",
  projectId: "lithilexicon",
  storageBucket: "lithilexicon.firebasestorage.app",
  messagingSenderId: "833231691799",
  appId: "1:833231691799:web:e255267530aa537a453c52",
  measurementId: "G-ZBERZ5LZQK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
