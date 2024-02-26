import React, { createContext, useContext } from "react";
import CryptoJS from "crypto-js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Adjust the path as necessary
import useMainStore from "../store/mainStore";

const UserContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const { setIsAuthenticated, setCurrentUser } = useMainStore();
  // Function to check if the user ID already exists
  const checkUserIdExists = async (id) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists();
  };

  // Function to hash password and save user data
  const saveUserData = async ({
    userId,
    firstName,
    lastName,
    password,
    securityQuestions,
  }) => {
    // First check if the ID already exists
    const exists = await checkUserIdExists(userId);
    if (exists) {
      console.error("User ID already exists.");
      return false; // Return false to indicate the save operation didn't proceed
    }

    // Hash the password
    const hashedPassword = CryptoJS.SHA256(password).toString();

    // Prepare user data for saving, including hashed password and security questions
    const userData = {
      firstName,
      lastName,
      password: hashedPassword,
      securityQuestions,
      balance: 100,
    };

    // Save user data to Firestore
    try {
      await setDoc(doc(db, "users", userId), userData);
      console.log("User data saved successfully.");
      return true; // Return true to indicate success
    } catch (error) {
      console.error("Error saving user data:", error);
      return false; // Return false on error
    }
  };

  const authenticateUser = async (userId, password) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error("No user found with the provided ID.");
      return false; // User not found
    }

    // Retrieve the stored hashed password
    const userDoc = docSnap.data();
    const storedHashedPassword = userDoc.password;

    // Hash the provided password to compare
    const hashedPassword = CryptoJS.SHA256(password).toString();

    if (hashedPassword === storedHashedPassword) {
      console.log("Authentication successful.");
      // Exclude password from the user details saved in the global state
      const { password, securityQuestions, ...userDataWithoutSensitiveInfo } =
        userDoc;
      const userDataWithId = {
        ...userDataWithoutSensitiveInfo,
        id: docSnap.id,
      };
      // Update Zustand store with the authenticated status and user data
      setIsAuthenticated(true);
      setCurrentUser(userDataWithId);
      return { isAuthenticated: true, isAdmin: userDoc.isAdmin || false };
    } else {
      console.error("Authentication failed. Incorrect password.");
      return false; // Passwords do not match
    }
  };

  // Value to be passed to the context consumers
  const value = {
    saveUserData,
    checkUserIdExists,
    authenticateUser,
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
