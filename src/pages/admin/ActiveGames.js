import React, { useEffect } from "react";
import useMainStore from "../../store/mainStore";
import { useGameAuth } from "../../context/GameContext";
import { Box, Button } from "@mui/material";
import GameCard from "./GameCard";

const ActiveGames = () => {
  const { activeGameSessions } = useMainStore();
  const { fetchGameSessions } = useGameAuth();
  useEffect(() => {
    console.log(activeGameSessions);
  }, []);
  const handleRefetch = async () => {
    await fetchGameSessions();
  };

  const sortedSessions = activeGameSessions.sort(
    (a, b) => b.startTime.seconds - a.startTime.seconds
  );
  return (
    <Box>
      <Button variant="contained" onClick={handleRefetch}>
        Refetch games
      </Button>
      {sortedSessions.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </Box>
  );
};

export default ActiveGames;
