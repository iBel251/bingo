import React, { createContext, useContext } from "react";
import CryptoJS from "crypto-js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase"; // Adjust the path as necessary
import useMainStore from "../store/mainStore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const UserContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const { setIsAuthenticated, setCurrentUser } = useMainStore();
  const registerWithEmailPassword = async (userDetail) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userDetail.email,
        userDetail.password
      );
      const user = userCredential.user;

      // Now, save the additional user data to Firestore
      // Create a reference to the user document in Firestore
      const userRef = doc(db, "users", user.uid);
      const { password, ...additionalUserData } = userDetail;
      // Combine the additional user data with the UID
      const userData = {
        ...additionalUserData, // Contains firstName, lastName, etc.
        uid: user.uid, // Ensure the user's UID is included
        balance: 300,
        bonus: 0,
        pendingBets: [],
        bets: {},
      };

      // Save the combined user data to Firestore
      await setDoc(userRef, userData);

      console.log("User registration and data saving successful.");
      return { success: true, user: user };
    } catch (error) {
      console.error("Error registering new user:", error);
      return { success: false, error: error };
    }
  };

  // Function to log in a user with email and password
  const loginWithEmailPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // User is signed in
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("User login successful.");
        return { success: true, user: user, userData: userData };
      } else {
        console.log("No additional user data found");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error: error };
    }
  };
  const fetchUserData = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setCurrentUser(userData);
      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.error("Error fetching userdata:", error);
    }
  };

  // Value to be passed to the context consumers
  const value = {
    registerWithEmailPassword,
    loginWithEmailPassword,
    fetchUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUserAuth = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserAuth must be used within an AuthContextProvider");
  }

  return context;
};
