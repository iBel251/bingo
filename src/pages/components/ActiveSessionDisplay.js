import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import SessionCard from "./SessionCard";

const ActiveSessionDisplay = ({ sessionData, currentUser }) => {
  return (
    <Box sx={{ background: "gray" }}>
      <h2
        style={{
          color: "orange",
          margin: "0",
          textAlign: "center",
          background: "blue",
        }}
      >
        Bingo Sessions
      </h2>
      {sessionData.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          currentUser={currentUser}
        />
      ))}
    </Box>
  );
};

export default ActiveSessionDisplay;
