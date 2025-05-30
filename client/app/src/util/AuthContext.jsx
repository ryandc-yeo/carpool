import React, { createContext, useState, useContext, useEffect } from 'react';
import db from "../firebase-config"
import { doc , getDoc } from "firebase/firestore";
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restorePhoneNumber = async () => {
      try {
        const storedPhone = await SecureStore.getItemAsync('phoneNumber');
        if (storedPhone) {
          setPhoneNumber(storedPhone);
          const userDoc = await getDoc(doc(db, "users", storedPhone));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      } finally {
        setLoading(false);
      }
    };
    restorePhoneNumber();
  }, []);

  const login = async (phone) => {
    const userDoc = await getDoc(doc(db, "users", phone));
    if (!userDoc.exists()) {
      alert("cannot login");
      return;
    }
    setPhoneNumber(phone);
    setUserData(userDoc.data());
    await SecureStore.setItemAsync('phoneNumber', phone);
  };

  const logout = async () => {
    setPhoneNumber(null);
    setUserData(null);
    await SecureStore.deleteItemAsync('phoneNumber');
  };

  return (
    <AuthContext.Provider value={{ phoneNumber, setPhoneNumber, login, logout, userData, setUserData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
