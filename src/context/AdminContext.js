import React, { createContext, useContext } from "react";
import CryptoJS from "crypto-js";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  Timestamp,
  updateDoc,
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
  const generateRandomWinners = (
    winnersCount,
    winnablePositions,
    numbersChosenByUsers
  ) => {
    const winners = new Array(winnersCount).fill(0); // Initialize winners array with 0s
    const availableNumbers = new Set(numbersChosenByUsers); // Use a Set for efficient lookup

    // Ensure winnablePositions is sorted so we fill from the highest priority
    winnablePositions.sort((a, b) => a - b);

    winnablePositions.forEach((position, index) => {
      if (position <= winnersCount && availableNumbers.size > 0) {
        // Randomly select a winner from availableNumbers
        const randomIndex = Math.floor(Math.random() * availableNumbers.size);
        const selectedNumber = Array.from(availableNumbers)[randomIndex];

        winners[position - 1] = selectedNumber; // Assign the selected number to the corresponding winnable position
        availableNumbers.delete(selectedNumber); // Remove the selected number from availableNumbers to avoid duplicates
      }
    });

    return winners;
  };

  const finalizeBingoSession = async (gameId, winnersData) => {
    try {
      const sessionDocRef = doc(db, "bingoSessions", "activeGames");
      const completedDocRef = doc(db, "bingoSessions", "completedGames");
      const gameFieldPath = `${gameId}`; // Adjust if necessary

      // Retrieve the current game data
      const docSnap = await getDoc(sessionDocRef);
      if (!docSnap.exists()) {
        throw new Error("Document does not exist!");
      }
      const gameData = docSnap.data()[gameFieldPath];
      if (!gameData) {
        throw new Error("Game data not found!");
      }

      // Prepare data for the completed games collection (remove participants data)
      const completedGameData = {
        ...gameData,
        winners: winnersData,
        endTime: Timestamp.now(),
        isOver: true,
        // Remove participants data
      };
      delete completedGameData.participants; // Remove participants data to save firebase data consumption

      // Update the nested field within the activeGames document to finalize it
      const updateData = {
        [`${gameFieldPath}.winners`]: winnersData,
        [`${gameFieldPath}.endTime`]: Timestamp.now(),
        [`${gameFieldPath}.isOver`]: true,
      };
      await updateDoc(sessionDocRef, updateData);

      // Move the game data to the completedGames document
      await updateDoc(completedDocRef, {
        [`${gameId}`]: completedGameData, // Set the game data under its ID as a field
      });

      console.log(`Bingo session ${gameId} has been finalized.`);
      return { success: true };
    } catch (error) {
      console.error("Error finalizing bingo session:", error);
      return { success: false, error };
    }
  };

  // Value to be passed to the context consumers
  const value = {
    startNewBingoSession,
    generateRandomWinners,
    finalizeBingoSession,
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
