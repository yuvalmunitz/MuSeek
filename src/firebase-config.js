
// // import { getAuth } from 'firebase/auth';
// // import { getFirestore } from "@firebase/firestore";
// // import { getStorage } from "@firebase/storage";
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDTGNWYWjnwyrBfuAfLMrU6Vkz-VurTyrY",
//   authDomain: "museek-huji.firebaseapp.com",
//   projectId: "museek-huji",
//   storageBucket: "museek-huji.appspot.com",
//   messagingSenderId: "367025322381",
//   appId: "1:367025322381:web:6c4dff1c758a4f3947a5c4"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();

// export { auth, provider, signInWithPopup };

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from "firebase/auth";

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

export { auth, provider, signInWithRedirect, getRedirectResult, signInWithPopup };