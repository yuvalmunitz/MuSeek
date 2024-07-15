import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyDTGNWYWjnwyrBfuAfLMrU6Vkz-VurTyrY",
  authDomain: "museek-huji.firebaseapp.com",
  projectId: "museek-huji",
  storageBucket: "museek-huji.appspot.com",
  messagingSenderId: "367025322381",
  appId: "1:367025322381:web:6c4dff1c758a4f3947a5c4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);  // Add this line

export {
  auth,
  provider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  db,
  storage  // Add this line
};