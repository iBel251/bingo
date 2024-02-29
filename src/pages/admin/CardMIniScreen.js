import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAdminAuth } from "../../context/AdminContext";
import HandleWinners from "./HandleWinners";

const calculateWinnings = (totalBet, position) => {
  const percentages = { 1: 0.6, 2: 0.2, 3: 0.1, 4: 0.04, 5: 0.02 };
  return totalBet * percentages[position];
};

const determinePayablePositions = (totalBet, totalRealBets) => {
  const positions = [1, 2, 3, 4, 5];
  const winnings = positions.map((position) =>
    calculateWinnings(totalBet, position)
  );
  let remainingRealBets = totalRealBets;
  const payablePositions = [];

  for (let i = 0; i < winnings.length; i++) {
    if (winnings[i] <= remainingRealBets) {
      payablePositions.push(i + 1); // Add the position to the payable list
      remainingRealBets -= winnings[i]; // Deduct the winning amount from the remaining bets
    }
    // If the remaining bets are not enough for the next win, skip to the next one
    if (remainingRealBets <= 0) break; // Stop if we run out of payable money
  }

  return payablePositions;
};

const styles = {
  container: {
    border: "1px solid black",
    height: "100%",
  },
  winnings: {
    marginTop: "20px",
    width: "fit-content",
    minWidth: "100px",
    background: "rgba(0, 0, 0, 0.4)",
    height: "fit-content",
    padding: "5px",
    border: "1px solid #ccc", // Subtle border for the mini display
    borderRadius: "8px",
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "0px",
  },
  winAmount: {
    fontWeight: "bold",
    color: "gold", // Rich red for winnings to make it stand out
  },
};

const CardMIniScreen = ({ game }) => {
  const { generateRandomWinners } = useAdminAuth();
  const [winners, setWinners] = useState([]);
  const [gameState, setGameState] = useState({
    isFull: false,
    realBetters: 0,
    jockerBetters: 0,
    totalBet: 0,
    totalRealBets: 0,
    realBetNumbers: [],
    jockerBetNumbers: [],
    payablePositions: [],
  });
  useEffect(() => {
    const totalBet = game.betAmount * game.maxParticipants;
    const realParticipants = game.participants.filter(
      (participant) => participant.userId !== "123456"
    );
    const jockerBetters = game.participants.filter(
      (participant) => participant.userId === "123456"
    );
    const totalRealBets = realParticipants.length * game.betAmount;
    const payablePositions = determinePayablePositions(totalBet, totalRealBets);
    const realBetNumbers = realParticipants.map((p) => p.number);
    const jockerBetNumbers = jockerBetters.map((p) => p.number);
    setGameState({
      isFull: game.maxParticipants === game.participants.length,
      realBetters: realParticipants.length,
      jockerBetters: jockerBetters,
      totalBet: totalBet,
      totalRealBets: totalRealBets,
      realBetNumbers: realBetNumbers,
      jockerBetNumbers: jockerBetNumbers,
      payablePositions: payablePositions,
    });
  }, [game]);
  const handleFinishBet = () => {
    console.log("game id:", game.id);
    console.log("is full:", gameState.isFull);
    console.log("Real betters:", gameState.realBetters);
    console.log("Real bet cash:", gameState.realBetters * game.betAmount);
  };
  const handleWinnersData = (result) => {
    // Map the result (winning numbers) to user IDs
    const winnersData = result.map((winningNumber, index) => {
      if (winningNumber === 0) {
        return {
          number: winningNumber,
          userId: "123456",
          name: "jocker",
          winAmount: calculateWinnings(gameState.totalBet, index + 1),
        }; // Special case for number 0
      }

      // Find the participant who bet on this number
      const participant = game.participants.find(
        (p) => p.number === winningNumber
      );

      if (participant) {
        return {
          number: winningNumber,
          userId: participant.userId,
          name: participant.name,
          winAmount: calculateWinnings(gameState.totalBet, index + 1),
        };
      } else {
        // If no participant is found (which should not happen), return a placeholder
        return { number: winningNumber, userId: "not_found" };
      }
    });

    console.log("Winners data:", winnersData);
    // Now you can set the state with this data or handle it however you need
    setWinners(winnersData);
  };
  const handleGenerate = () => {
    if (gameState.isFull) {
      const result = generateRandomWinners(
        5,
        gameState.payablePositions,
        gameState.realBetNumbers
      );
      handleWinnersData(result);
    } else {
      console.log("betting is not done yet.");
    }
  };
  return (
    <Box sx={styles.container}>
      <Box sx={{ display: "flex" }}>
        <Box style={styles.winnings}>
          {[1, 2, 3, 4, 5].map((position) => (
            <p key={position} style={styles.winAmount}>
              <strong style={{ color: "#DC3545", fontSize: "10px" }}>
                {position}ኛ እጣ:
              </strong>{" "}
              {calculateWinnings(gameState.totalBet, position)}{" "}
              <strong style={{ color: "#DC3545", fontSize: "10px" }}>ብር</strong>
            </p>
          ))}
        </Box>
        <Box>
          <HandleWinners
            game={game}
            winnersData={winners}
            jockerBetNumbers={gameState.jockerBetNumbers}
          />
        </Box>
      </Box>
      <Box>
        {gameState.realBetters * game.betAmount} Birr betted by real players
        <br />
        <Box sx={{ display: "flex" }}>
          winable positions{" "}
          {gameState.payablePositions?.map((p) => (
            <Box
              key={p}
              sx={{ border: "1px solid black", p: "1px 6px", m: "2px" }}
            >
              {p}
            </Box>
          ))}
        </Box>
      </Box>
      <Button variant="contained" onClick={handleFinishBet}>
        Finish game
      </Button>
      <Button variant="contained" onClick={handleGenerate}>
        Generate winners
      </Button>
    </Box>
  );
};

export default CardMIniScreen;
