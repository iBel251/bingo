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
import { useGameAuth } from "../context/GameContext";
import useMainStore from "../store/mainStore";
import { useNavigate } from "react-router-dom";

const NumberPickerDialog = ({ isOpen, onClose, session, currentUser }) => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { placeBet, fetchGameSessions } = useGameAuth();
  const { updateUserBalance } = useMainStore();
  const pickedNumbers =
    session.participants?.map((participant) => participant.number) || [];
  const userId = currentUser.uid;
  const canBet = session.betAmount <= currentUser.balance;
  const navigate = useNavigate();

  useEffect(() => {
    if (pickedNumbers.includes(selectedNumber)) {
      setErrorMessage("This number is already taken. Please choose another.");
    } else {
      setErrorMessage("");
    }
  }, [session]);
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
    if (pickedNumbers.includes(number)) {
      setErrorMessage("This number is already taken. Please choose another.");
    } else {
      setSelectedNumber(number);
      setErrorMessage(""); // Clear error message when a valid number is selected
    }
  };

  const handleConfirmSelection = async () => {
    setIsLoading(true);
    const fullName = currentUser.firstName + " " + currentUser.lastName;
    if (selectedNumber !== null) {
      const result = await placeBet(
        userId,
        session.id,
        session.betAmount,
        selectedNumber,
        fullName
      );

      if (result.success) {
        fetchGameSessions();
        updateUserBalance(currentUser.balance - session.betAmount);
        onClose(); // Close the dialog upon successful selection
      } else {
        if (result.error === "Insufficient balance") {
          setErrorMessage("Not enough balance");
        } else {
          setErrorMessage("Failed to place bet. Please try again.");
        }
      }
      setSelectedNumber(null); // Reset selected number
      setIsLoading(false);
    }
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
                  variant={number === selectedNumber ? "contained" : "outlined"}
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
              selectedNumber === null || errorMessage !== "" || isLoading
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
