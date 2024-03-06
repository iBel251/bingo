import React, { createContext, useContext, useEffect } from "react";
import CryptoJS from "crypto-js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  runTransaction,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import useMainStore from "../store/mainStore";
import { useUserAuth } from "./AuthContext";

const GameContext = createContext(null);

export const GameContextProvider = ({ children }) => {
  const {
    setActiveGameSessions,
    setCompletedGameSessions,
    setCurrentUser,
    currentUser,
  } = useMainStore();
  const { fetchUserData } = useUserAuth();
  const currentUserId = currentUser?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.id) {
        const docRef = doc(db, "users", currentUser.id);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const updatedData = docSnap.data();
            const { password, securityQuestions, ...updatedUserData } =
              updatedData;
            setCurrentUser({ ...updatedUserData, id: docSnap.id }); // Update user data
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUserId]); // Depend on currentUserId to refetch when it changes

  const fetchGameSessions = async () => {
    // Reference to the "activeGames" document in the "bingoSessions" collection
    const docRef = doc(db, "bingoSessions", "activeGames");

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // If the document exists, access its data
        const activeGamesData = docSnap.data();
        // Assuming the structure of the data is an object with game IDs as keys
        // Convert it to an array if needed, for easier handling in UI components
        const sessions = Object.entries(activeGamesData).map(
          ([id, gameData]) => ({
            id, // Assuming each game has a unique ID
            ...gameData, // Spread the rest of the game data
          })
        );
        // Update your application state with the fetched sessions
        setActiveGameSessions(sessions);
        console.log("games:", sessions);
      } else {
        console.log("No such document!");
        setActiveGameSessions([]); // Optional: Handle the case where the document does not exist
      }
    } catch (error) {
      console.error("Error fetching active game sessions:", error);
    }
  };
  const fetchCompletedGameSessions = async () => {
    // Reference to the "activeGames" document in the "bingoSessions" collection
    const docRef = doc(db, "bingoSessions", "completedGames");

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // If the document exists, access its data
        const completedGamesData = docSnap.data();
        // Assuming the structure of the data is an object with game IDs as keys
        // Convert it to an array if needed, for easier handling in UI components
        const sessions = Object.entries(completedGamesData).map(
          ([id, gameData]) => ({
            id, // Assuming each game has a unique ID
            ...gameData, // Spread the rest of the game data
          })
        );
        // Update your application state with the fetched sessions
        setCompletedGameSessions(sessions);
        console.log("games:", sessions);
      } else {
        console.log("No such document!");
        setCompletedGameSessions([]); // Optional: Handle the case where the document does not exist
      }
    } catch (error) {
      console.error("Error fetching active game sessions:", error);
    }
  };

  const placeBet = async (userId, gameId, amount, chosenNumber, fullName) => {
    console.log("parameteres", userId, gameId, amount, chosenNumber, fullName);
    try {
      // Reference to the user document
      const userRef = doc(db, "users", userId);

      // Fetch user data for preliminary checks
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
      const userData = userDoc.data();
      const currentBalance = userData.balance;

      if (currentBalance - amount < 0) {
        throw new Error("Insufficient balance");
      }

      // Reference to the activeGames document
      const activeGamesRef = doc(db, "bingoSessions", "activeGames");

      // Fetch activeGames document for game data
      const activeGamesDoc = await getDoc(activeGamesRef);
      if (!activeGamesDoc.exists()) {
        throw new Error("Active games not found");
      }
      const activeGamesData = activeGamesDoc.data();
      const gameData = activeGamesData[gameId]; // Access specific game data using gameId

      if (!gameData) {
        throw new Error("Game session not found");
      }

      const currentParticipants = gameData.participants || [];
      if (currentParticipants.length >= gameData.maxParticipants) {
        throw new Error("Game session is full");
      }

      if (
        currentParticipants.some(
          (participant) => participant.number === chosenNumber
        )
      ) {
        throw new Error("Number already chosen by another participant");
      }

      // Proceed with the transaction if checks pass
      await runTransaction(db, async (transaction) => {
        // Update user's balance and pending bets
        const updatedBalance = currentBalance - amount;
        const pendingBet = {
          gameId,
          amount,
          chosenNumber,
          timestamp: new Date(),
        };
        const updatedPendingBets = userData.pendingBets
          ? [...userData.pendingBets, pendingBet]
          : [pendingBet];
        transaction.update(userRef, {
          balance: updatedBalance,
          pendingBets: updatedPendingBets,
          bets: {
            ...userData.bets, // Preserve existing bets
            [gameId]:
              userData.bets && userData.bets[gameId]
                ? [...userData.bets[gameId], chosenNumber] // Append to existing array if game ID already present
                : [chosenNumber], // Initialize with chosen number if game ID not present
          },
        });

        // Update the game session's participant list
        const updatedParticipants = [
          ...currentParticipants,
          { userId, amount, number: chosenNumber, name: fullName },
        ];
        const updatedGameData = {
          ...gameData,
          participants: updatedParticipants,
        };
        // Update the activeGames document with the updated game data
        transaction.set(
          activeGamesRef,
          { [gameId]: updatedGameData },
          { merge: true }
        );
      });
      fetchUserData(userId);
      console.log("Bet placed successfully");
      return { success: true };
    } catch (error) {
      console.error("Error placing bet:", error);
      return { success: false, error: error.message };
    }
  };
  const placeAdminBets = async (userId, gameId, amount, chosenNumber) => {
    const fullName = "jocker";
    try {
      // Reference to the activeGames document
      const activeGamesRef = doc(db, "bingoSessions", "activeGames");

      // Fetch activeGames document for game data
      const activeGamesDoc = await getDoc(activeGamesRef);
      if (!activeGamesDoc.exists()) {
        throw new Error("Active games not found");
      }
      const activeGamesData = activeGamesDoc.data();
      const gameData = activeGamesData[gameId]; // Access specific game data using gameId

      if (!gameData) {
        throw new Error("Game session not found");
      }

      const currentParticipants = gameData.participants || [];
      if (currentParticipants.length >= gameData.maxParticipants) {
        throw new Error("Game session is full");
      }

      if (
        currentParticipants.some(
          (participant) => participant.number === chosenNumber
        )
      ) {
        throw new Error("Number already chosen by another participant");
      }

      // Proceed with the transaction if checks pass
      await runTransaction(db, async (transaction) => {
        // Update the game session's participant list
        const updatedParticipants = [
          ...currentParticipants,
          { userId, amount, number: chosenNumber, name: fullName },
        ];
        const updatedGameData = {
          ...gameData,
          participants: updatedParticipants,
        };
        // Update the activeGames document with the updated game data
        transaction.update(activeGamesRef, { [gameId]: updatedGameData });
      });

      console.log("Bet placed successfully");
      return { success: true };
    } catch (error) {
      console.error("Error placing bet:", error);
      return { success: false, error: error.message };
    }
  };

  // Value to be passed to the context consumers
  const value = {
    fetchGameSessions,
    fetchCompletedGameSessions,
    placeBet,
    placeAdminBets,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use the context
export const useGameAuth = () => {
  const context = useContext(GameContext);

  if (context === undefined) {
    throw new Error("useUserAuth must be used within an AuthContextProvider");
  }

  return context;
};
