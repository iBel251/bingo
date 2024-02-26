import React, { useState } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useMainStore from "../../store/mainStore"; // Adjust path as necessary
import { useAdminAuth } from "../../context/AdminContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { startNewBingoSession } = useAdminAuth();
  const { currentUser, logout } = useMainStore((state) => ({
    currentUser: state.currentUser,
    logout: state.logout,
    startNewBingoSession: state.startNewBingoSession, // Make sure this function is provided by your store
  }));

  const [betAmount, setBetAmount] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [duration, setDuration] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await startNewBingoSession(betAmount, maxParticipants, duration);
    // Reset form or provide feedback as necessary
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
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          label="Bet Amount"
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
          required
          sx={{ mr: 2 }}
        />
        <TextField
          label="Max Participants"
          type="number"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          required
          sx={{ mr: 2 }}
        />
        <TextField
          label="Duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
          sx={{ mr: 2 }}
        />
        <Button type="submit" variant="contained">
          Start New Session
        </Button>
      </Box>
      <div>Admin Content</div>
    </div>
  );
};

export default AdminDashboard;
