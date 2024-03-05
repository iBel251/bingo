import React, { useEffect } from "react";
import { Typography, Box, LinearProgress } from "@mui/material";
import darkBackground from "../../assets/bgDarkmin.jpg";
import Lottie from "react-lottie-player";
import animationData from "../../assets/animations/diceGolden.json";
import ResultsDisplay from "./ResultsDisplay";

// Define styles for the component with a professional color scheme
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "10px",
    margin: "0px",
    border: "1px solid gold", // Light gray border for contrast against the dark background
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Slightly transparent white to let the dark background show through
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Enhanced shadow for depth on dark backgrounds
    backgroundImage: `url(${darkBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderTopLeftRadius: "0px",
    color: "#FFFFFF", // White text color for all text for readability
  },
  item: {
    margin: "10px 0",
  },
  highlight: {
    fontWeight: "bold",
    color: "#F9D342", // Bright yellow for highlighting, ensuring visibility on dark backgrounds
  },
  detailText: {
    fontSize: "12px",
    textAlign: "center",
    color: "#CCCCCC", // Light gray for less critical text, maintaining readability
    background: "black",
    width: "100%",
    margin: "10px 0px -10px 0px",
  },
  progressBar: {
    width: "100%",
    "& > * + *": {
      margin: "0 0 16px 0",
    },
  },
  animationContainer: {
    width: "50px",
    height: "50px",
  },
};

const MiniDisplay = ({ countdown, session, userBets }) => {
  const betsLeft = session.maxParticipants - session?.participants?.length || 0;
  const peopleBetted = session.participants.length;
  const progress = (peopleBetted / session.maxParticipants) * 100;

  return (
    <Box sx={styles.container}>
      {!session?.isOver ? (
        <Box>
          <Box sx={styles.progressBar}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  ...styles.item,
                  ...styles.highlight,
                  margin: "0px",
                  textAlign: "center",
                }}
                variant="h6"
                component="div"
              >
                በሂደት ላይ...
              </Typography>
              <Box sx={styles.animationContainer}>
                <Lottie
                  loop
                  animationData={animationData}
                  play
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: "10px", // Makes the progress bar thicker
                backgroundColor: "rgba(255, 255, 255, 0.3)", // Lighter shade for the background of the progress bar
                animation: "pulsate 1s infinite",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#FFD700", // Gold color for the progress bar fill
                },
                "@keyframes pulsate": {
                  "0%": { opacity: 0.7 },
                  "50%": { opacity: 0.3 },
                  "100%": { opacity: 0.7 },
                },
              }}
            />
          </Box>
          <Typography sx={styles.item} variant="body1">
            የተቆረጡ እጣዎች: <span style={styles.highlight}>{peopleBetted}</span>
          </Typography>
          <Typography sx={styles.item} variant="body1">
            ቀሪ እጣዎች: <span style={styles.highlight}>{betsLeft}</span>
          </Typography>
          {userBets?.length > 0 && (
            <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
              የእርሶ መደብ
              <br /> {userBets.join(", ")}
            </Typography>
          )}
          <Typography
            sx={{ ...styles.item, ...styles.detailText }}
            variant="body1"
          >
            እጣው ሲወጣ የአሸናፊዎች ዝርዝር እዚሁ ላይ ማየት ይቻላል። ለሁሉም አሸናፊዎች ያገኙት ብር በቀጥታ ቀሪ
            ሂሳባቸው ላይ ይደመራል።
          </Typography>
        </Box>
      ) : (
        <ResultsDisplay session={session} userBets={userBets} />
      )}
    </Box>
  );
};

export default MiniDisplay;
