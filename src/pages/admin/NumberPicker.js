import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useGameAuth } from "../../context/GameContext";
import useMainStore from "../../store/mainStore";
import { useNavigate } from "react-router-dom";

const NumberPickerDialog = ({ isOpen, onClose, session, currentUser }) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { placeBet, fetchGameSessions, placeAdminBets } = useGameAuth();
  const { updateUserBalance } = useMainStore();
  const pickedNumbers =
    session.participants?.map((participant) => participant.number) || [];
  const userId = currentUser.uid;
  const canBet = session.betAmount <= currentUser.balance;
  const navigate = useNavigate();

  useEffect(() => {
    if (!canBet) {
      setErrorMessage("Not enough balance");
    }
  }, [canBet, session]);
  useEffect(() => {
    const updateGameData = async () => {
      if (isOpen && canBet) {
        setIsPageLoading(true);
        const updatedSession = await fetchGameSessions();
        setIsPageLoading(false);
      }
    };
    updateGameData();
  }, [isOpen]);

  const onNumberSelected = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleConfirmSelection = async () => {
    setIsLoading(true);
    // Adjust the logic to iterate over selectedNumbers
    for (let number of selectedNumbers) {
      await placeAdminBets(userId, session.id, session.betAmount, number);
    }
    setIsLoading(false);
    fetchGameSessions(); // Refresh session data
    onClose(); // Close the dialog
    setSelectedNumbers([]); // Reset selected numbers
  };

  const handleDiposit = () => {
    navigate("/account", { state: { action: "deposit" } });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="number-picker-dialog-title"
    >
      <DialogTitle
        id="number-picker-dialog-title"
        sx={{ background: "#1A202C", color: "white", textAlign: "center" }}
      >
        {canBet && "የእጣ ቁጥሮን ይምረጡ"}

        {errorMessage === "Not enough balance" ? (
          <>
            <Typography color="error" sx={{ mb: 2 }}>
              ያሎት ቀሪ ሂሳብ ይሄን ዙር ለመመደብ በቂ አደለም። እባኮ ተጨማሪ አስገብተው ይሞክሩ።
            </Typography>
            <Button
              onClick={handleDiposit}
              variant="contained"
              sx={{
                background: "gold",
                color: "#1A202C",
                "&:hover": {
                  background: "inherit",
                  color: "gold",
                  border: "1px solid gold",
                },
              }}
            >
              Deposit
            </Button>
          </>
        ) : errorMessage ? (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        ) : null}
      </DialogTitle>
      {isPageLoading ? (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <CircularProgress size={50} sx={{ color: "gold" }} />
          <Typography sx={{ color: "#1A202C" }}>
            Loading bet numbers...
          </Typography>
        </Box>
      ) : !canBet ? null : (
        <DialogContent>
          <Grid container spacing={2}>
            {Array.from(
              { length: session.maxParticipants },
              (_, i) => i + 1
            ).map((number) => (
              <Grid item xs={3} key={number}>
                <Button
                  variant={
                    selectedNumbers.includes(number) ? "contained" : "outlined"
                  }
                  onClick={() => onNumberSelected(number)}
                  disabled={pickedNumbers.includes(number)}
                  sx={{
                    backgroundColor: pickedNumbers.includes(number)
                      ? "gray"
                      : undefined,
                    width: "10px",
                  }}
                >
                  {number}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      )}
      <DialogActions sx={{ background: "#1A202C" }}>
        {canBet && (
          <Button
            onClick={handleConfirmSelection}
            disabled={
              selectedNumbers?.length === 0 || errorMessage !== "" || isLoading
            }
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "16px",
              background: " gold",
            }}
          >
            {isLoading ? <CircularProgress size={25} /> : "መድብ"}
          </Button>
        )}
        <Button onClick={onClose} sx={{ color: "white" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NumberPickerDialog;
