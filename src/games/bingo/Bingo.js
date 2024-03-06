import React, { useEffect, useState } from "react";
import useMainStore from "../../store/mainStore";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import background from "../../assets/roller.webp";
import { useGameAuth } from "../../context/GameContext";
import CompletedSessionDisplay from "./CompletedSessionDisplay";
import MyBets from "./MyBets";
import SessionDisplay from "./SessionDisplay";

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
    backgroundRepeat: "no-repeat", // Ensures the background doesn't tile
    backgroundAttachment: "fixed",
    display: "flex",
    justifyContent: "center",
  },
  loadingIndicator: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    height: "100%",
  },
  navBtn: {
    color: "black",
    width: "33%",
    margin: "0",
    padding: "3px 0",
    background: "goldenrod",
    fontSize: "0.7rem",
    fontWeight: "bold",
    "&:hover": {
      color: "goldenrod",
    },
  },
  activeNavBtn: {
    color: "goldenrod",
    background: "#03070A",
  },
};

const Bingo = () => {
  const { currentUser, logout, activeGameSessions } = useMainStore((state) => ({
    currentUser: state.currentUser,
    logout: state.logout,
    activeGameSessions: state.activeGameSessions,
  }));
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [view, setView] = useState("active"); // Possible values: 'active', 'completed', 'betted'

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
      <Box
        sx={{
          paddingTop: "100px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            background: "rgba(0,0,0,0.9)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Button
            onClick={() => setView("active")}
            sx={{
              ...styles.navBtn,
              ...(view === "active" && styles.activeNavBtn),
            }}
          >
            Active Games
          </Button>
          <Button
            onClick={() => setView("completed")}
            sx={{
              ...styles.navBtn,
              ...(view === "completed" && styles.activeNavBtn),
            }}
          >
            Completed Games
          </Button>
          <Button
            onClick={() => setView("betted")}
            sx={{
              ...styles.navBtn,
              ...(view === "betted" && styles.activeNavBtn),
            }}
          >
            My Bets
          </Button>
        </Box>

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
        ) : view === "active" && activeGameSessions ? (
          <Box>
            <SessionDisplay
              sessionData={activeGameSessions}
              currentUser={currentUser}
            />
          </Box>
        ) : view === "completed" ? (
          <CompletedSessionDisplay />
        ) : view === "betted" ? (
          <MyBets />
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
