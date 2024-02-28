import React, { useEffect, useState } from "react";
import useMainStore from "../../store/mainStore";
import { useNavigate } from "react-router-dom";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

// Custom styles
const styles = {
  appBar: {
    backgroundColor: "#2E3B55", // Deep, rich blue
    color: "#DAA520", // Golden text for a luxurious feel
  },
  balanceDisplay: {
    flexGrow: 1,
    cursor: "pointer",
    fontWeight: "bold",
  },
  logoutButton: {
    color: "black", // Golden button text
    backgroundColor: "#DAA520", // Golden border for the button
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#DAA570",
      color: "#2E3B55", // Text color changes on hover
    },
  },
};

const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useMainStore((state) => ({
    currentUser: state.currentUser,
    logout: state.logout,
    activeGameSessions: state.activeGameSessions,
  }));

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div>
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={styles.balanceDisplay}
            onClick={() => navigate("/account")}
          >
            {currentUser?.balance || "0"} ብር
          </Typography>
          <Button
            color="inherit"
            sx={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
