import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase-config'; // Adjust the import according to your project structure
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                // Fetch additional user data from Firestore
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setCurrentUser({
                        uid: user.uid,
                        ...userSnap.data()
                    });
                } else {
                    // no user data in firestore
                    setCurrentUser({
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL
                    });
                }
            } else {
                // no user sign in
                setCurrentUser(null);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {children}
        </AuthContext.Provider>
    );
}
