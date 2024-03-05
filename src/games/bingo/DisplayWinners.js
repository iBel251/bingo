import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const DisplayWinners = ({ session }) => {
  return (
    <Box>
      {session?.isOver && session?.winners ? (
        <TableContainer
          component={Paper}
          sx={{ background: "none", overflow: "hidden" }}
        >
          <Table aria-label="winners table">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ color: "goldenrod", padding: "2px" }}
                >
                  Name
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "goldenrod", padding: "2px" }}
                >
                  Win
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {session.winners.map((winner, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    sx={{ color: "white", padding: "2px" }}
                  >
                    {winner.name} ({winner.number})
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white", padding: "2px" }}
                  >
                    {winner.winAmount}ብር
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ mt: 2, color: "white" }}>
          Waiting for server results.
        </Typography>
      )}
    </Box>
  );
};

export default DisplayWinners;
