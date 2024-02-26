import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { useGameAuth } from "../context/GameContext";

const NumberPickerDialog = ({ isOpen, onClose, session, currentUser }) => {
  const [selectedNumber, setSelectedNumber] = useState(null);
  const { placeBet } = useGameAuth();
  const pickedNumbers =
    session.participants?.map((participant) => participant.number) || [];
  const userId = currentUser.id;
  const onNumberSelected = (number) => {
    setSelectedNumber(number);
  };

  const handleConfirmSelection = async () => {
    if (selectedNumber !== null) {
      console.log(
        userId,
        session.id, // gameId from session
        session.betAmount, // Assuming betAmount is part of session
        selectedNumber
      );
      try {
        // Assuming placeBet function signature is (userId, gameId, amount, chosenNumber)
        const result = await placeBet(
          userId,
          session.id, // gameId from session
          session.betAmount, // Assuming betAmount is part of session
          selectedNumber
        );

        if (result.success) {
          console.log("Bet placed successfully");
          // Perform any additional actions on success
        } else {
          console.error("Failed to place bet", result.error);
          // Handle failure (e.g., show an error message)
        }
      } catch (error) {
        console.error("Error placing bet:", error);
        // Handle any unexpected errors
      }
      setSelectedNumber(null);
      onClose(); // Close the dialog upon selection or if there's an error
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="number-picker-dialog-title"
    >
      <DialogTitle id="number-picker-dialog-title">
        Select Your Number
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {Array.from({ length: session.maxParticipants }, (_, i) => i + 1).map(
            (number) => (
              <Grid item xs={4} key={number}>
                <Button
                  fullWidth
                  variant={number === selectedNumber ? "contained" : "outlined"}
                  onClick={() => onNumberSelected(number)}
                  disabled={pickedNumbers.includes(number)}
                >
                  {number}
                </Button>
              </Grid>
            )
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleConfirmSelection}
          disabled={selectedNumber === null}
        >
          Confirm
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NumberPickerDialog;
