import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { getOrCreateUser } from 'users'; // Adjust the path to your users.js file

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async (currentUser) => {
      try {
        const userData = await getOrCreateUser(currentUser.uid);
        setUserData(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      setUser(user);
      const userData = await getOrCreateUser(user.uid);
      setUserData(userData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setUser(null);
      setUserData(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
