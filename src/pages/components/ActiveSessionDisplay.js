import React from "react";
import { Box, Typography, Container } from "@mui/material";
import SessionCard from "./SessionCard";

// Custom styles
const styles = {
  container: {
    background: "#1A202C", // A dark background for contrast
    padding: " 0", // Top and bottom padding
    borderRadius: "0px", // Rounded corners for the container
    margin: "0px auto", // Center the container with some margin
  },
  header: {
    color: "#FFD700", // Golden color for the header to add a luxurious feel
    textAlign: "center",
    marginBottom: "20px", // Space between header and cards
  },
};

const ActiveSessionDisplay = ({ sessionData, currentUser }) => {
  const sortedSessions = sessionData.sort(
    (a, b) => b.startTime.seconds - a.startTime.seconds
  );

  console.log(sortedSessions);

  return (
    <Container sx={styles.container}>
      {/* <Typography variant="h4" component="h2" sx={styles.header}>
        Bingo Sessions
      </Typography> */}
      {sortedSessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          currentUser={currentUser}
        />
      ))}
    </Container>
  );
};

export default ActiveSessionDisplay;
