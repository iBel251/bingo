import React, { useEffect } from "react";
import { Typography, Box } from "@mui/material";
import darkBackground from "../../assets/bgDarkmin.jpg";

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
};

const MiniDisplay = ({ countdown, session, userBets }) => {
  const betsLeft = session.maxParticipants - session.participants.length;
  const peopleBetted = session.participants.length;
  useEffect(() => {
    console.log("id: ", userBets);
  }, [userBets]);
  return (
    <Box sx={styles.container}>
      <Typography
        sx={{ ...styles.item, ...styles.highlight }}
        variant="h6"
        component="div"
      >
        ቀሪ ሰአት: {countdown}
      </Typography>
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
      <Typography sx={{ ...styles.item, ...styles.detailText }} variant="body1">
        እጣው ሲወጣ የአሸናፊዎች ዝርዝር እዚሁ ላይ ማየት ይቻላል። ለሁሉም አሸናፊዎች ያገኙት ብር በቀጥታ ቀሪ ሂሳባቸው
        ላይ ይደመራል።
      </Typography>
    </Box>
  );
};

export default MiniDisplay;
