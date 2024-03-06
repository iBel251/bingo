import { Box, Typography } from "@mui/material";
import React from "react";
import DisplayWinners from "./DisplayWinners";
import useMainStore from "../../store/mainStore";

const styles = {
  container: {
    textAlign: "center",
    margin: "0px",
    color: "#FFFFFF", // White text color for all text for readability
  },
  item: {
    margin: "5px 0",
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
const ResultsDisplay = ({ session, userBets }) => {
  const { currentUser } = useMainStore();
  const gameId = session?.id || null;
  const bets = gameId ? currentUser.bets[gameId] : [];
  const effectiveUserBets = bets || userBets;

  console.log(bets);
  return (
    <Box sx={styles.container}>
      <Typography sx={styles.item} variant="body1">
        የተቆረጡ እጣዎች:{" "}
        <span style={styles.highlight}>{session.maxParticipants}</span>
      </Typography>

      {effectiveUserBets?.length > 0 ? (
        <Typography variant="body1" sx={{ mt: "5px", textAlign: "center" }}>
          የእርሶ መደብ
          <br /> {effectiveUserBets.join(", ")}
        </Typography>
      ) : (
        "በዚህ ዙር አልተሳተፉም።"
      )}
      <Box sx={{ border: "1px solid white" }}>
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "goldenrod" }}
        >
          አሸናፊዎች
        </Typography>
        <Box>
          <DisplayWinners session={session} />
        </Box>
      </Box>
      <Typography sx={{ ...styles.item, ...styles.detailText }} variant="body1">
        ሁሉም ተጫዋቾች ያሸነፉት ገንዘብ በቀጥታ ቀሪ ሂሳብ ላይ ተደምሯል። Online መጠበቅ ግዴታ አደለም። ያሸነፉትን
        ገንዘብ በማንኛውም ሰአት ያለገደብ ወጪ ማድረግ ይችላሉ።
      </Typography>
    </Box>
  );
};

export default ResultsDisplay;
