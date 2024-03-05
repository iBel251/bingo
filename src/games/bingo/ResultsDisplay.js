import { Box, Typography } from "@mui/material";
import React from "react";
import DisplayWinners from "./DisplayWinners";

const styles = {
  container: {
    textAlign: "center",
    margin: "0px",
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
const ResultsDisplay = ({ session, userBets }) => {
  return (
    <Box sx={styles.container}>
      <Typography sx={styles.item} variant="body1">
        የተቆረጡ እጣዎች:{" "}
        <span style={styles.highlight}>{session.maxParticipants}</span>
      </Typography>

      {userBets?.length > 0 ? (
        <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
          የእርሶ መደብ
          <br /> {userBets.join(", ")}
        </Typography>
      ) : (
        "በዚህ ዙር አልተሳተፉም።"
      )}
      <Typography
        variant="body1"
        sx={{ mt: 2, textAlign: "center", color: "goldenrod" }}
      >
        አሸናፊዎች
      </Typography>
      <Box>
        <DisplayWinners session={session} />
      </Box>
      <Typography sx={{ ...styles.item, ...styles.detailText }} variant="body1">
        እጣው ሲወጣ የአሸናፊዎች ዝርዝር እዚሁ ላይ ማየት ይቻላል። ለሁሉም አሸናፊዎች ያገኙት ብር በቀጥታ ቀሪ ሂሳባቸው
        ላይ ይደመራል።
      </Typography>
    </Box>
  );
};

export default ResultsDisplay;
