import React, { useEffect, useState } from "react";
import useMainStore from "../store/mainStore";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { useGameAuth } from "../context/GameContext";
import ActiveSessionDisplay from "./components/ActiveSessionDisplay";

const Main = () => {
  const { fetchBingoSessions } = useGameAuth();
  const navigate = useNavigate();
  const { currentUser, logout, activeGameSessions } = useMainStore((state) => ({
    currentUser: state.currentUser,
    logout: state.logout,
    activeGameSessions: state.activeGameSessions,
  }));
  const [loadingSessions, setLoadingSessions] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/account")}
          >
            Balance: {currentUser?.balance || "0"} Birr
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {loadingSessions ? (
        <CircularProgress />
      ) : (
        <Box>
          <ActiveSessionDisplay
            sessionData={activeGameSessions}
            currentUser={currentUser}
          />
        </Box>
      )}
    </div>
  );
};

export default Main;
