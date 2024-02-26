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
} from "@mui/material";
import { useGameAuth } from "../context/GameContext";

const NumberPickerDialog = ({ isOpen, onClose, session, currentUser }) => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { placeBet } = useGameAuth();
  const pickedNumbers =
    session.participants?.map((participant) => participant.number) || [];
  const userId = currentUser.id;

  useEffect(() => {
    if (pickedNumbers.includes(selectedNumber)) {
      setErrorMessage("This number is already taken. Please choose another.");
    } else {
      setErrorMessage("");
    }
  }, [session]);
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
    if (selectedNumber !== null) {
      const result = await placeBet(
        userId,
        session.id,
        session.betAmount,
        selectedNumber
      );

      if (result.success) {
        console.log("Bet placed successfully");
        onClose(); // Close the dialog upon successful selection
      } else {
        console.error("Failed to place bet", result.error);
        setErrorMessage("Failed to place bet. Please try again.");
      }
      setSelectedNumber(null); // Reset selected number
      setIsLoading(false);
    }
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
        የእጣ ቁጥሮን ይምረጡ
        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {Array.from({ length: session.maxParticipants }, (_, i) => i + 1).map(
            (number) => (
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
            )
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ background: "#1A202C" }}>
        <Button
          onClick={handleConfirmSelection}
          disabled={selectedNumber === null || errorMessage !== "" || isLoading}
          sx={{
            color: "black",
            fontWeight: "bold",
            fontSize: "16px",
            background: " gold",
          }}
        >
          {isLoading ? <CircularProgress size={25} /> : "መድብ"}
        </Button>
        <Button onClick={onClose} sx={{ color: "white" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NumberPickerDialog;
