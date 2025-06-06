import React, { createContext, useState, useContext, useEffect } from 'react';
import db from "../firebase-config"
import { doc , getDoc } from "firebase/firestore";
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goingFriday, setGoingFriday] = useState(false);
  const [goingSunday, setGoingSunday] = useState(false);

  useEffect(() => {
    const restorePhoneNumber = async () => {
      try {
        const storedPhone = await SecureStore.getItemAsync('phoneNumber');
        console.log("Restored user from SecureStore:", storedPhone);
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
      return false;
    }
    setPhoneNumber(phone);
    setUserData(userDoc.data());

    const friDoc = await getDoc(doc(db, "Friday Passengers", phone));
    if (!friDoc.exists()) {
      const friDriveDoc = await getDoc(doc(db, "Friday Drivers", phone));
      if (!friDriveDoc.exists()) {
        setGoingFriday(false);
      }
      else {
        setGoingFriday(true);
      }
    }
    else {
      setGoingFriday(true);
    }

    const sunDoc = await getDoc(doc(db, "Sunday Passengers", phone));
    if (!sunDoc.exists()) {
      const sunDriveDoc = await getDoc(doc(db, "Sunday Drivers", phone));
      if (!sunDriveDoc.exists()) {
        setGoingSunday(false);
      }
      else {
        setGoingSunday(true);
      }
    }
    else {
      setGoingSunday(true);
    }
    // setGoingFriday(false);
    // setGoingSunday(false);

    await SecureStore.setItemAsync('phoneNumber', phone);
    return true;
  };

  const logout = async () => {
    setPhoneNumber(null);
    setUserData(null);
    setGoingFriday(false);
    setGoingSunday(false);
    await SecureStore.deleteItemAsync('phoneNumber');
  };

  return (
    <AuthContext.Provider value={{ phoneNumber, setPhoneNumber, login, logout, userData, setUserData, loading, goingFriday, setGoingFriday, goingSunday, setGoingSunday }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
