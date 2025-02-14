import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJytNbZApCDTq_1gWSQlF2IqOexD8VttY",
  authDomain: "examen-61785.firebaseapp.com",
  databaseURL: "https://examen-61785-default-rtdb.firebaseio.com",
  projectId: "examen-61785",
  storageBucket: "examen-61785.appspot.com",
  messagingSenderId: "889839375505",
  appId: "1:889839375505:web:48280d5e19acd2d587db30",
  measurementId: "G-MSM1G36JX9",
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
