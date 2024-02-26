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

const GameContext = createContext(null);

export const GameContextProvider = ({ children }) => {
  const { setActiveGameSessions, setCurrentUser, currentUser } = useMainStore();
  // Function to check if the user ID already exists
  useEffect(() => {
    const q = query(collection(db, "bingoSessions"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const sessions = [];
        querySnapshot.forEach((doc) => {
          sessions.push({ id: doc.id, ...doc.data() });
        });
        setActiveGameSessions(sessions);
      },
      (error) => {
        console.error("Error fetching bingo sessions:", error);
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Subscribe to current user data in real-time
  useEffect(() => {
    if (currentUser && currentUser.id) {
      const docRef = doc(db, "users", currentUser.id);
      const unsubscribeUser = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            const updatedData = doc.data();
            const { password, securityQuestions, ...updatedUserData } =
              updatedData;
            setCurrentUser({ ...updatedUserData, id: doc.id }); // Update user data in real-time
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
        }
      );

      return () => unsubscribeUser(); // Cleanup function to unsubscribe
    }
  }, [currentUser, setCurrentUser]);

  const placeBet = async (userId, gameId, amount, chosenNumber) => {
    try {
      // Reference to user and game documents
      const userRef = doc(db, "users", userId);
      const gameRef = doc(db, "bingoSessions", gameId);

      // Fetch user and game data outside the transaction for preliminary checks
      const userDoc = await getDoc(userRef);
      const gameDoc = await getDoc(gameRef);

      // Check if user and game documents exist
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
      if (!gameDoc.exists()) {
        throw new Error("Game session not found");
      }

      // Preliminary checks
      const userData = userDoc.data();
      const currentBalance = userData.balance;

      if (currentBalance - amount < 0) {
        throw new Error("Insufficient balance");
      }

      const currentParticipants = gameDoc.data().participants || [];
      if (currentParticipants.length >= gameDoc.data().maxParticipants) {
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
        // Calculate the new balance and prepare the pending bet object
        const updatedBalance = currentBalance - amount;
        const pendingBet = {
          gameId,
          amount,
          chosenNumber,
          timestamp: new Date(), // Optionally include a timestamp for tracking
        };

        // Update the user's balance and append the pending bet to their document
        const updatedPendingBets = userData.pendingBets
          ? [...userData.pendingBets, pendingBet]
          : [pendingBet];
        transaction.update(userRef, {
          balance: updatedBalance,
          pendingBets: updatedPendingBets,
        });

        // Update the game session's participant list
        const updatedParticipants = [
          ...currentParticipants,
          { userId, amount, number: chosenNumber },
        ];
        transaction.update(gameRef, { participants: updatedParticipants });
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
    placeBet,
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
