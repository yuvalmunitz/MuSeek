// src/auth.js
import { auth } from './firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Sign up function
export const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in function
export const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Sign out function
export const logOut = () => {
    return signOut(auth);
};
