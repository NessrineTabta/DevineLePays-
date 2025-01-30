import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth'; 

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJytNbZApCDTq_1gWSQlF2IqOexD8VttY",
  authDomain: "examen-61785.firebaseapp.com",
  databaseURL: "https://examen-61785-default-rtdb.firebaseio.com",
  projectId: "examen-61785",
  storageBucket: "examen-61785.appspot.com",
  messagingSenderId: "889839375505",
  appId: "1:889839375505:web:48280d5e19acd2d587db30",
  measurementId: "G-MSM1G36JX9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { db, storage, auth, googleProvider, facebookProvider };
