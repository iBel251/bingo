import React from "react";
import { Typography, Box } from "@mui/material";

// Define styles for the component with a professional color scheme
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    padding: "10px",
    margin: "0px",
    border: "2px solid #2E3B55", // Dark blue for trust and professionalism
    borderRadius: "8px",
    backgroundColor: "#F3F4F6", // Light gray background for contrast and readability
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
  },
  item: {
    margin: "10px 0",
    color: "#2E3B55", // Dark blue for text to match the border
  },
  highlight: {
    fontWeight: "bold",
    color: "#DAA520", // Gold for highlighting important info, adds a luxury feel
  },
  detailText: {
    fontSize: "12px",
    textAlign: "center",
  },
};

const MiniDisplay = ({ countdown, session }) => {
  const betsLeft = session.maxParticipants - session.participants.length;
  const peopleBetted = session.participants.length;

  return (
    <Box sx={styles.container}>
      <Typography
        sx={{ ...styles.item, ...styles.highlight }}
        variant="h6"
        component="div"
      >
        ቀሪ ሰዐት: {countdown}
      </Typography>
      <Typography sx={styles.item} variant="body1">
        የተቆረጡ እጣዎች: <span style={styles.highlight}>{peopleBetted}</span>
      </Typography>
      <Typography sx={styles.item} variant="body1">
        ቀሪ እጣዎች: <span style={styles.highlight}>{betsLeft}</span>
      </Typography>
      <Typography sx={{ ...styles.item, ...styles.detailText }} variant="body1">
        እጣው ሲወጣ የአሸናፊዎች ዝርዝር እዚሁ ላይ ማየት ይቻላል። ለአሸናፊዎች በቀጥታ ወደ አካውንታቸው ገቢ ይደረጋል።
      </Typography>
    </Box>
  );
};

export default MiniDisplay;
