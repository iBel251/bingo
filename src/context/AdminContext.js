import React, { createContext, useContext } from "react";
import CryptoJS from "crypto-js";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import useMainStore from "../store/mainStore";

const AdminContext = createContext(null);

export const AdminContextProvider = ({ children }) => {
  const { setIsAuthenticated, setCurrentUser } = useMainStore();
  // Function to check if the user ID already exists
  const startNewBingoSession = async (betAmount, maxParticipants, duration) => {
    const newSession = {
      startTime: Timestamp.now(), // Marks the start time of the session
      endTime: null,
      participants: [],
      isOver: false, // Indicates whether the session is still active
      betAmount: Number(betAmount),
      maxParticipants: Number(maxParticipants),
      duration: Number(duration),
    };

    try {
      const sessionRef = await addDoc(
        collection(db, "bingoSessions"),
        newSession
      );
      console.log(`New bingo session started with ID: ${sessionRef.id}`);
      return { success: true, sessionId: sessionRef.id };
    } catch (error) {
      console.error("Error starting new bingo session:", error);
      return { success: false, error };
    }
  };

  // Value to be passed to the context consumers
  const value = {
    startNewBingoSession,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

// Custom hook to use the context
export const useAdminAuth = () => {
  const context = useContext(AdminContext);

  if (context === undefined) {
    throw new Error("useUserAuth must be used within an AuthContextProvider");
  }

  return context;
};
