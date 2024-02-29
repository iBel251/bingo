import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { useAdminAuth } from "../../context/AdminContext";

const styles = {
  tableContainer: {
    maxWidth: "100%", // Ensures the container does not overflow its parent
  },
  table: {
    minWidth: 200, // Minimum width to ensure readability
    tableLayout: "auto", // Allows the table to adjust based on content
  },
  header: {
    background: "rgba(0, 0, 0, 0.8)",
    "& th": {
      color: "white",
      fontWeight: "bold",
      whiteSpace: "noWrap", // Prevents header text from wrapping
    },
  },
  cell: {
    maxWidth: "200px", // Maximum width for cells to prevent overly wide cells
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis", // Adds an ellipsis for overflow text
  },
  jocker: {
    backgroundColor: "rgba(255, 235, 59, 0.7)", // Light yellow for jocker rows
    "& > *": {
      fontWeight: "bold",
    },
  },
};

const HandleWinners = ({ game, winnersData, jockerBetNumbers }) => {
  const { finalizeBingoSession } = useAdminAuth();
  const [validationError, setValidationError] = useState();
  const [updatedWinners, setUpdatedWinners] = useState([]);
  const gameId = game?.id;
  useEffect(() => {
    let jockerBetNumbersCopy = [...jockerBetNumbers]; // Create a copy of jockerBetNumbers

    const updatedWinnersData = winnersData.map((winner, index) => {
      if (winner.number === 0 && jockerBetNumbersCopy.length > 0) {
        // Pick the first number from jockerBetNumbersCopy
        const jockerNumber = jockerBetNumbersCopy.shift();
        return {
          ...winner,
          number: jockerNumber,
        }; // Replace number:0 with a jockerNumber
      }
      return winner; // Return the winner unmodified if number is not 0
    });
    setUpdatedWinners(updatedWinnersData);
  }, [winnersData]);
  if (!winnersData || winnersData.length < 1) {
    return;
  }
  const handleSave = async () => {
    if (!validateWinners()) {
      // Validation failed, do not proceed with saving
      console.error(validationError);
      return;
    }
    await finalizeBingoSession(gameId, updatedWinners);
    console.log("done");
  };

  const validateWinners = () => {
    // Check if any jocker has an empty name or still has the placeholder "Enter Jocker Name"
    const invalidJocker = updatedWinners.find(
      (winner) =>
        winner.userId === "123456" &&
        (!winner.name || winner.name === "jocker" || winner.name.trim() === "")
    );

    if (invalidJocker) {
      setValidationError("Please ensure all jocker names are changed.");
      return false; // Validation failed
    }

    setValidationError(""); // Reset validation error
    return true; // Validation passed
  };

  const handleNameChange = (number, newName) => {
    setUpdatedWinners((currentWinners) => {
      return currentWinners.map((winner) => {
        if (winner.number === number) {
          return { ...winner, name: newName };
        }
        return winner;
      });
    });
  };

  return (
    <Box sx={styles.tableContainer}>
      <TableContainer component={Paper}>
        <Table sx={styles.table} aria-label="winners table" size="small">
          <TableHead sx={styles.header}>
            <TableRow>
              <TableCell>Pos</TableCell>
              <TableCell align="right">Num</TableCell>
              <TableCell align="right" sx={styles.cell}>
                User ID
              </TableCell>
              <TableCell align="right" sx={styles.cell}>
                Name
              </TableCell>
              <TableCell align="right" sx={styles.cell}>
                Win
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updatedWinners?.map((winner, index) => (
              <TableRow
                key={index}
                sx={winner.userId === "123456" ? styles.jocker : null}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">{winner.number}</TableCell>
                <TableCell align="right" sx={styles.cell}>
                  {winner.userId}
                </TableCell>
                <TableCell align="right" sx={styles.cell}>
                  {winner.userId === "123456" ? (
                    <TextField
                      value={winner.name}
                      onChange={(e) =>
                        handleNameChange(winner.number, e.target.value)
                      }
                      placeholder="Enter Jocker Name"
                    />
                  ) : (
                    winner.name
                  )}
                </TableCell>
                <TableCell align="right" sx={styles.cell}>
                  {winner.winAmount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>
      {validationError && (
        <Box sx={{ color: "red", marginTop: 2 }}>{validationError}</Box>
      )}
    </Box>
  );
};

export default HandleWinners;
