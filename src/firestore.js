// src/firestore.js
import { db } from './firebase-config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Add data to Firestore
export const addData = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

// Get data from Firestore
export const getData = async (collectionName) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
    });
    return data;
};
