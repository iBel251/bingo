import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import NumberPickerDialog from "./NumberPicker";
import useMainStore from "../../store/mainStore";
import CardMIniScreen from "./CardMIniScreen";

const styles = {
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  cardContentBox: {
    width: {
      xs: "100%",
      md: "50%",
    },
  },
  numList: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "500px",
  },
  numBox: {
    border: "1px solid black",
    margin: "2px",
    padding: "2px",
    width: "25px",
    textAlign: "center",
  },
};

const GameCard = ({ game }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [realParticipants, setRealParticipants] = useState([]);
  const [jockerParticipants, setJockerParticipants] = useState([]);
  const [realNumbers, setRealNumbers] = useState([]);
  const [jockerNumbers, setJockerNumbers] = useState([]);
  const { currentUser } = useMainStore();

  useEffect(() => {
    console.log(game);
    if (game) {
      const realP = game.participants.filter((p) => p.name != "jocker");
      const realNumbers = realP.map((p) => p.number);
      const jockerP = game.participants.filter((p) => p.name === "jocker");
      const jockerNumbers = jockerP.map((p) => p.number);
      setRealParticipants(realP);
      setJockerParticipants(jockerP);
      setJockerNumbers(jockerNumbers);
      setRealNumbers(realNumbers);
    }
  }, [game]);
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Convert seconds to a readable date
  const startTime = new Date(game.startTime.seconds * 1000);
  const formattedStartTime = format(startTime, "PPPpp");

  return (
    <Card
      sx={{
        minWidth: 275,
        marginBottom: 2,
        backgroundColor: "#f5f5f5",
        boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
      }}
    >
      <CardContent sx={styles.cardContainer}>
        <Box sx={styles.cardContentBox}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Game ID: {game.id}
          </Typography>
          <Typography variant="h5" component="div">
            Bet Amount: {game.betAmount} Birr
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Start Time: {formattedStartTime}
          </Typography>
          <Typography>Max Participants: {game.maxParticipants}</Typography>
          <Typography>
            Remaining Bets: {game.maxParticipants - game.participants.length}
          </Typography>
          <Box>
            Real Participants:{realParticipants.length}
            <Box sx={styles.numList}>
              {realNumbers.map((num) => (
                <Box key={num} sx={styles.numBox}>
                  {num}
                </Box>
              ))}
            </Box>
          </Box>
          <Box>
            Jocker Participants:{jockerParticipants.length}
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip label={`User ${jockerParticipants[0]?.userId}`} />
            </Stack>
            <Box sx={styles.numList}>
              {jockerNumbers.map((num) => (
                <Box key={num} sx={styles.numBox}>
                  {num}
                </Box>
              ))}
            </Box>
          </Box>
          <Button variant="outlined" onClick={handleOpenDialog}>
            Admin Bet
          </Button>

          <NumberPickerDialog
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            session={game}
            currentUser={currentUser}
          />
        </Box>
        <Box sx={styles.cardContentBox}>
          <CardMIniScreen game={game} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default GameCard;
