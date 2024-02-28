import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const styles = {
  container: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  appBar: {
    backgroundColor: "#2E3B55",
    color: "#FFF",
    width: "fit-content",
  },
  backButton: {
    marginRight: 2,
  },
};

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromDeposit = location.state?.from === "deposit";

  return (
    <>
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            sx={styles.backButton}
            onClick={() => navigate("/")}
          >
            <ArrowBackIcon />
            Back
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs" sx={styles.container}>
        <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
          <Typography component="h1" variant="h5">
            Your Account
          </Typography>
          {fromDeposit && (
            <Typography sx={{ mt: 2 }} color="error">
              Please deposit to continue.
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "gold",
              "&:hover": { bgcolor: "#DAA520" },
            }}
            onClick={() => navigate("/deposit", { state: { from: "account" } })}
          >
            Deposit Funds
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Account;
