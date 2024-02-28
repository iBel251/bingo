import React, { useState } from "react";
import {
  Typography,
  List,
  ListItem,
  Paper,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { useAdminAuth } from "../../context/AdminContext";

const styles = {
  winnerList: {
    marginTop: 16,
    padding: 16,
  },
  inputContainer: {
    marginTop: 16,
    display: "flex",
    gap: "20px",
    alignItems: "center",
    justifyContent: "center",
  },
};

const Winners = ({ totalNumbers }) => {
  const { generateRandomWinners } = useAdminAuth();
  const [winners, setWinners] = useState([]);
  const [winnersCount, setWinnersCount] = useState(5); // Default number of winners

  const handleGenerateWinners = () => {
    const generatedWinners = generateRandomWinners(totalNumbers, winnersCount);
    setWinners(generatedWinners);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Winners
      </Typography>
      <div style={styles.inputContainer}>
        <TextField
          label="Number of Winners"
          type="number"
          variant="outlined"
          value={winnersCount}
          onChange={(e) => setWinnersCount(Number(e.target.value))}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateWinners}
        >
          Generate Winners
        </Button>
      </div>
      <Paper elevation={3} style={styles.winnerList}>
        <List>
          {winners.map((winner, index) => (
            <ListItem key={index}>
              Winner {index + 1}: number {winner}
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default Winners;
