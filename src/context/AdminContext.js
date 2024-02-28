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
    // Generate a unique ID for the new game session
    // This could be a timestamp, a UUID, or any other unique identifier
    const gameId = doc(collection(db, "dummy")).id; // using Firestore to generate a unique ID

    const newSession = {
      startTime: Timestamp.now(),
      endTime: null,
      participants: [],
      isOver: false,
      betAmount: Number(betAmount),
      maxParticipants: Number(maxParticipants),
      duration: Number(duration),
    };

    try {
      // Path to the "activeGames" document in the "bingoSessions" collection
      const sessionPath = `bingoSessions/activeGames`;

      // Prepare the update object to only update the specific game session
      // This uses the gameId as a key in the document
      const updateSessionData = {};
      updateSessionData[`${gameId}`] = newSession; // Using dot notation to update a nested field

      // Use setDoc with { merge: true } to update the specific game session data within the "activeGames" document
      await setDoc(doc(db, sessionPath), updateSessionData, { merge: true });

      console.log(`New bingo session started with ID: ${gameId}`);
      return { success: true, sessionId: gameId };
    } catch (error) {
      console.error("Error starting new bingo session:", error);
      return { success: false, error };
    }
  };

  // Function to generate random winners
  const generateRandomWinners = (totalNumbers, winnersCount) => {
    const winners = new Set();
    while (winners.size < winnersCount) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const randomWinner = (array[0] % totalNumbers) + 1;
      winners.add(randomWinner);
    }
    return Array.from(winners);
  };

  // Value to be passed to the context consumers
  const value = {
    startNewBingoSession,
    generateRandomWinners,
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
