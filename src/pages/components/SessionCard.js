import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { useGameAuth } from "../../context/GameContext";
import NumberPicker from "../../modals/NumberPicker";
import MiniDisplay from "./MiniDisplay";

const styles = {
  container: {
    marginBottom: "20px",
    padding: "20px",
    border: "2px solid #2E3B55", // Dark blue for borders
    borderRadius: "8px",
    backgroundColor: "#F3F4F6", // Light gray for background
    position: "relative",
    color: "#333",
    maxWidth: "400px",
    margin: "auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
  },
  maxParticipants: {
    position: "absolute",
    top: "10px",
    left: "10px",
    fontWeight: "bold",
    color: "#DAA520", // Gold for highlighting max participants
  },
  betAmount: {
    position: "absolute",
    top: "0px",
    right: "0px",
    padding: "5px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#007bff", // Bright blue for bet amount background
  },
  middleSection: {
    display: "flex",
    justifyContent: "space-between",
  },
  winnings: {
    marginTop: "10px",
    width: "30%",
  },
  winAmount: {
    fontWeight: "bold",
    color: "#DC3545", // Rich red for winnings to make it stand out
  },
  miniDisplay: {
    width: "70%",
    padding: "0px",
    marginTop: "20px",
    border: "1px solid #ccc", // Subtle border for the mini display
    borderRadius: "8px",
    backgroundColor: "#FFFFFF", // White background for contrast
  },
};

const calculateWinnings = (totalBet, position) => {
  const percentages = { 1: 0.5, 2: 0.25, 3: 0.1, 4: 0.04, 5: 0.02 };
  return totalBet * percentages[position];
};

const SessionCard = ({ session, currentUser }) => {
  const { placeBet } = useGameAuth();
  const userId = currentUser.id || null;
  const [countdown, setCountdown] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chosenNumber, setChosenNumber] = useState(null);
  const pickedNumbers =
    session.participants?.map((participant) => participant.number) || [];

  const handlePlaceBet = async (chosenNumber) => {
    // Assuming the placeBet function now accepts a chosenNumber parameter
    const result = await placeBet(
      userId,
      session.id,
      session.betAmount,
      chosenNumber
    );
    console.log(result); // Placeholder, adjust based on your needs
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const fetchCurrentUTCTime = async () => {
    try {
      const response = await fetch(
        "https://worldtimeapi.org/api/timezone/Etc/UTC"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch time");
      }
      const data = await response.json();
      return new Date(data.utc_datetime); // Returns the current UTC time as a Date object
    } catch (error) {
      console.error("Error fetching current UTC time:", error);
      return null;
    }
  };

  useEffect(() => {
    let intervalId;

    const calculateCountdown = async () => {
      const currentTime = await fetchCurrentUTCTime();
      if (!currentTime) {
        setCountdown("Error fetching time");
        return;
      }
      const durationMs = session.duration * 60 * 60 * 1000;
      const endTime = new Date(session.startTime.seconds * 1000 + durationMs);
      const distance = endTime.getTime() - currentTime.getTime();

      if (distance < 0) {
        setCountdown("Session has ended");
        clearInterval(intervalId);
        setIsActive(false);
        return;
      }
      setIsActive(true);
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (days === 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    calculateCountdown();
    intervalId = setInterval(calculateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [session.startTime.seconds, session.duration]);

  const totalBet = session.betAmount * session.maxParticipants;

  return (
    <Paper elevation={2} style={styles.container}>
      <Typography
        variant="subtitle2"
        component="div"
        style={styles.maxParticipants}
      >
        {session.maxParticipants} እጣዎች
      </Typography>
      <Typography variant="subtitle2" component="div" style={styles.betAmount}>
        መደብ ፡ {session.betAmount} ብር
      </Typography>
      <Box sx={styles.middleSection}>
        <Box style={styles.winnings}>
          {[1, 2, 3, 4, 5].map((position) => (
            <p key={position} style={styles.winAmount}>
              <strong>{position}ኛ እጣ:</strong>{" "}
              {calculateWinnings(totalBet, position)} ብር
            </p>
          ))}
        </Box>
        <Box sx={styles.miniDisplay}>
          <MiniDisplay countdown={countdown} session={session}></MiniDisplay>
        </Box>
      </Box>
      {isActive ? (
        <Button variant="outlined" onClick={handleOpenDialog}>
          Bet
        </Button>
      ) : null}
      <NumberPicker
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        setChosenNumber={setChosenNumber}
        session={session}
        currentUser={currentUser}
      />
    </Paper>
  );
};

export default SessionCard;
