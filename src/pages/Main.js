import React, { useEffect, useState } from "react";
import useMainStore from "../store/mainStore";
import { Box, CircularProgress, Container } from "@mui/material";
import ActiveSessionDisplay from "./components/ActiveSessionDisplay";

// Custom styles
const styles = {
  appBar: {
    backgroundColor: "#2E3B55", // Deep, rich blue
    color: "#DAA520", // Golden text for a luxurious feel
  },
  balanceDisplay: {
    flexGrow: 1,
    cursor: "pointer",
    fontWeight: "bold",
  },
  logoutButton: {
    color: "#1A202C", // Golden button text
    backgroundColor: "red", // Golden border for the button
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#DAA520",
      color: "#2E3B55", // Text color changes on hover
    },
  },
  container: {
    margin: "0px",
    padding: "0px",
  },
  loadingIndicator: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
};

const Main = () => {
  const { currentUser, logout, activeGameSessions } = useMainStore((state) => ({
    currentUser: state.currentUser,
    logout: state.logout,
    activeGameSessions: state.activeGameSessions,
  }));
  const [loadingSessions, setLoadingSessions] = useState(false);

  return (
    <div>
      {loadingSessions ? (
        <Box sx={styles.loadingIndicator}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Container sx={styles.container}>
          <ActiveSessionDisplay
            sessionData={activeGameSessions}
            currentUser={currentUser}
          />
        </Container>
      )}
    </div>
  );
};

export default Main;
