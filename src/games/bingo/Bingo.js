import React, { useEffect, useState } from "react";
import useMainStore from "../../store/mainStore";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import ActiveSessionDisplay from "./ActiveSessionDisplay";
import background from "../../assets/roller.webp";
import { useGameAuth } from "../../context/GameContext";

// Custom styles
const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    margin: "0px",
    background: "white",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.5)),url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  loadingIndicator: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    height: "100%",
  },
};

const Bingo = () => {
  const { currentUser, logout, activeGameSessions } = useMainStore((state) => ({
    currentUser: state.currentUser,
    logout: state.logout,
    activeGameSessions: state.activeGameSessions,
  }));
  const [loadingSessions, setLoadingSessions] = useState(false);
  const { fetchGameSessions } = useGameAuth();

  useEffect(() => {
    const fetch = async () => {
      setLoadingSessions(true);
      await fetchGameSessions();
      setLoadingSessions(false);
    };
    if (!activeGameSessions) {
      fetch();
    }
  }, []);

  return (
    <Box sx={styles.container}>
      <Box sx={{ paddingTop: "100px" }}>
        {loadingSessions ? (
          <Box sx={styles.loadingIndicator}>
            <CircularProgress size={100} sx={{ color: "goldenrod" }} />
            <Typography
              variant="h4"
              sx={{
                color: "goldenrod",
                textAlign: "center",
              }}
            >
              {" "}
              Loading Games...
            </Typography>
          </Box>
        ) : activeGameSessions ? (
          <Container>
            <ActiveSessionDisplay
              sessionData={activeGameSessions}
              currentUser={currentUser}
            />
          </Container>
        ) : (
          <Typography
            variant="h5"
            sx={{
              color: "whitesmoke",
              textAlign: "center",
            }}
          >
            No Game Sessions available for now, please come back letter.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Bingo;
