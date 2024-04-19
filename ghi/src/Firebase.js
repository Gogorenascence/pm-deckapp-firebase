// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDgkedttmEsg5xpChub6FDbr5AVhs9NEJM",
  authDomain: "cardbase-1b1a7.firebaseapp.com",
  projectId: "cardbase-1b1a7",
  storageBucket: "cardbase-1b1a7.appspot.com",
  messagingSenderId: "117633820016",
  appId: "1:117633820016:web:9dcc33b1e4d3d11767dbb5",
  measurementId: "G-HR98ZZXXBM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export const db = getFirestore(app)
