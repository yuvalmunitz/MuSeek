import React, {createContext, useContext, useEffect, useState} from 'react';
import {auth} from '../firebase-config'; // Adjust the import according to your project structure

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        return auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                });
            } else {
                setCurrentUser(null);
            }
        });
    }, []);

    const signOut = () => {
        return auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ currentUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
