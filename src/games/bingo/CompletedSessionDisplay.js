import React, { useEffect, useState } from "react";
import { useGameAuth } from "../../context/GameContext";
import useMainStore from "../../store/mainStore";
import { Box } from "@mui/material";
import SessionDisplay from "./SessionDisplay";
import { GridLoader } from "react-spinners";

const CompletedSessionDisplay = () => {
  const { fetchCompletedGameSessions } = useGameAuth();
  const { completedGameSessions, activeGameSessions, currentUser } =
    useMainStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompletedGameData = async () => {
      setIsLoading(true);
      await fetchCompletedGameSessions();

      setIsLoading(false);
    };
    fetchCompletedGameData();
  }, []);

  return (
    <Box>
      {!isLoading ? (
        <SessionDisplay
          sessionData={completedGameSessions || []}
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

export default CompletedSessionDisplay;
