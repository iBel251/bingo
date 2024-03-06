import React, { useEffect, useState } from "react";
import { useGameAuth } from "../../context/GameContext";
import useMainStore from "../../store/mainStore";
import { Box } from "@mui/material";
import SessionDisplay from "./SessionDisplay";
import { GridLoader } from "react-spinners";

const MyBets = () => {
  const { fetchCompletedGameSessions } = useGameAuth();
  const { completedGameSessions, activeGameSessions, currentUser } =
    useMainStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userParticipatedSessions, setUserParticipatedSessions] = useState([]);

  useEffect(() => {
    const fetchCompletedGameData = async () => {
      setIsLoading(true);
      await fetchCompletedGameSessions();

      setIsLoading(false);
    };
    fetchCompletedGameData();
  }, []);

  useEffect(() => {
    const combinedSessions = [...activeGameSessions, ...completedGameSessions];
    const betsKeys = Object.keys(currentUser.bets || {});

    // Create a temporary object to store unique games
    const uniqueGamesMap = {};

    combinedSessions.forEach((session) => {
      if (betsKeys.includes(session.id) && !uniqueGamesMap[session.id]) {
        uniqueGamesMap[session.id] = session;
      }
    });

    // Convert the uniqueGamesMap back into an array
    const participatedSessions = Object.values(uniqueGamesMap);

    setUserParticipatedSessions(participatedSessions);
  }, [activeGameSessions, completedGameSessions, currentUser.bets]);

  return (
    <Box>
      {!isLoading ? (
        <SessionDisplay
          sessionData={userParticipatedSessions || []}
          currentUser={currentUser}
        />
      ) : (
        <Box
          sx={{
            height: "300px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <GridLoader color="rgba(218, 165, 32)" size={30} />
        </Box>
      )}
    </Box>
  );
};

export default MyBets;
