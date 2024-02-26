import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import { useGameAuth } from "../../context/GameContext";
import NumberPicker from "../../modals/NumberPicker";
import MiniDisplay from "./MiniDisplay";
import useMainStore from "../../store/mainStore";
import diceBackground from "../../assets/dicebackground.webp";
import miniBg from "../../assets/minibg.jpg";
import goldenBtn from "../../assets/goldenBtn2.jpg";

const styles = {
  container: {
    border: "1px solid #2E3B55", // Dark blue for borders
    borderRadius: "0px",
    backgroundColor: "#F3F4F6", // Light gray for background
    backgroundImage: `url(${diceBackground})`,
    backgroundSize: "cover", // Cover the entire area of the container
    backgroundPosition: "center",
    position: "relative",
    color: "#333",
    maxWidth: "400px",
    margin: "10px auto",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
  },
  secondContainer: {
    background: "rgba(0, 0, 0, 0.7)", // Black overlay with 50% opacity
    padding: "20px 10px",
  },
  maxParticipants: {
    position: "absolute",
    top: "0px",
    left: "0px",
    padding: "5px",
    fontWeight: "bold",
    color: "#DAA520", // Gold for highlighting max participants
    background: "#1A202C",
    border: "1px solid gold",
  },
  betAmount: {
    position: "absolute",
    top: "0px",
    right: "0px",
    padding: "5px",
    fontWeight: "bold",
    color: "#1A202C",
    backgroundColor: "#007bff", // Bright blue for bet amount background
    backgroundImage: `url(${goldenBtn})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  middleSection: {
    display: "flex",
    justifyContent: "center",
    gap: 0,
  },
  winnings: {
    marginTop: "20px",
    width: "fit-content",
    background: "rgba(0, 0, 0, 0.4)",
    height: "fit-content",
    padding: "5px",
    border: "1px solid #ccc", // Subtle border for the mini display
    borderRadius: "8px",
    backgroundImage: `url(${miniBg})`,
    backgroundSize: "cover", // Cover the entire area of the container
    backgroundPosition: "center",
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "0px",
  },
  winAmount: {
    fontWeight: "bold",
    color: "gold", // Rich red for winnings to make it stand out
  },
  miniDisplay: {
    width: "65%",
    padding: "0px",
    marginTop: "20px",
    borderRadius: "8px",
    backgroundColor: "gray",
    borderTopLeftRadius: "0px",
  },
  betBtn: {
    backgroundImage: `url(${goldenBtn})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    width: "100px",
    height: "30px",
    border: "none",
    transition: "box-shadow 0.3s ease", // Smooth transition for the shadow effect
    boxShadow: "2px 2px 5px rgba(218, 165, 32, 0.7)", // Initial shadow to create the floating effect
    "&:hover": {
      border: "none",
      opacity: 0.8,
      // Enhanced golden shadow on hover
      boxShadow: "0px 4px 10px rgba(218, 165, 32, 0.6)",
    },
    color: "black",
    "&:active": {
      boxShadow: "inset 0 0 10px rgba(218, 165, 32, 0.3)",
    },
  },
};

const calculateWinnings = (totalBet, position) => {
  const percentages = { 1: 0.6, 2: 0.2, 3: 0.1, 4: 0.04, 5: 0.02 };
  return totalBet * percentages[position];
};

const SessionCard = ({ session, currentUser }) => {
  const { placeBet } = useGameAuth();
  const { activeGameSessions } = useMainStore();
  const userId = currentUser.id || null;
  const [countdown, setCountdown] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userBets, setUserBets] = useState([]); // Track numbers the user has bet on

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
    console.log("UserID:", userId);
    if (session.participants && userId) {
      const bets = session.participants
        .filter((participant) => participant.userId === userId)
        .map((participant) => participant.number);
      setUserBets(bets);
    }
  }, [session.participants, userId]);

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
    <Paper elevation={2} sx={styles.container}>
      <Box sx={styles.secondContainer}>
        <Typography
          variant="subtitle2"
          component="div"
          style={styles.maxParticipants}
        >
          {session.maxParticipants} እጣዎች
        </Typography>
        <Typography
          variant="subtitle2"
          component="div"
          style={styles.betAmount}
        >
          መደብ ፡ {session.betAmount} ብር
        </Typography>
        <Box sx={styles.middleSection}>
          <Box style={styles.winnings}>
            {[1, 2, 3, 4, 5].map((position) => (
              <p key={position} style={styles.winAmount}>
                <strong style={{ color: "#DC3545", fontSize: "10px" }}>
                  {position}ኛ እጣ:
                </strong>{" "}
                {calculateWinnings(totalBet, position)}{" "}
                <strong style={{ color: "#DC3545", fontSize: "10px" }}>
                  ብር
                </strong>
              </p>
            ))}
          </Box>
          <Box sx={styles.miniDisplay}>
            <MiniDisplay
              countdown={countdown}
              session={session}
              userBets={userBets}
            ></MiniDisplay>
          </Box>
        </Box>
        {isActive ? (
          <Button
            variant="outlined"
            onClick={handleOpenDialog}
            sx={styles.betBtn}
          >
            መድብ
          </Button>
        ) : null}
        <NumberPicker
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          session={session}
          currentUser={currentUser}
        />
      </Box>
    </Paper>
  );
};

export default SessionCard;
