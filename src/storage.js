// src/storage.js
import { storage } from './firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload file to Firebase Storage
export const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
};
