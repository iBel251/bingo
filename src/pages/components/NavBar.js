import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import { useNavigate } from "react-router-dom";
import useMainStore from "../../store/mainStore";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

// Define styles
const styles = {
  appBar: {
    backgroundColor: "rgb(0,0,0,0.8)", // Dark background for the AppBar for a professional look
    color: "#E3BC3F", // Golden color for text and icons to align with the theme
    position: "fixed",
    boxShadow: "none", // Remove shadow for a flat design
    zIndex: 100,

    "@media(max-width:900px)": {
      display: "flex",
      flexDirection: "column",
      width: "fit-content",
    },
  },
  menuIcon: {
    display: "none",
    "@media(max-width:900px)": {
      display: "block",
      position: "absolute",
      right: "-75px",
      fontSize: "40px",
      background: "rgba(0,0,0,0.8)",
      cursor: "pointer",
    },
  },
  toolbar: {
    "@media(max-width:900px)": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "left",
      alignItems: "left",
      width: "fit-content",
      margin: "10px 20px 40px 20px",
      position: "relative",
    },
  },
  logoContainer: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
  },
  navLinks: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    "@media(max-width:900px)": {
      flexDirection: "column",
      margin: "30px 0",
    },
  },
  loginSignup: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "flex-end",
    "@media(max-width:900px)": {
      flexDirection: "column",
      alignItems: "center",
      gap: "5px",
    },
  },
  navLinkButton: {
    margin: "0 10px",
    color: "#fff", // White color for contrast against the AppBar
    "&:hover": {
      backgroundColor: "#E3BC3F", // Golden color for hover state
      color: "#000", // Dark text color for readability
    },
  },
  activeLink: {
    backgroundColor: "#E3BC3F",
    color: "#000",
  },
  loginBtn: {
    color: "black",
    background: "goldenrod",
    marginRight: "5px",
    "&:hover": { background: "gold" },
  },
  signupBtn: {
    color: "goldenrod",
    background: "#00000080",
    border: "1px solid goldenrod",
    "&:hover": { background: "black" },
  },
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, currentPage, setCurrentPage, currentUser } =
    useMainStore();
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLinkClick = (page) => {
    setCurrentPage(page);
    if (page === "home") {
      navigate("/");
    } else {
      navigate(`/${page}`);
    }
  };
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log(isMenuOpen, isMobile);
  };
  return (
    <AppBar
      position="static"
      sx={{
        ...styles.appBar,
        ...(isMobile && {
          left: isMenuOpen ? "0px" : "-190px",
          transition: "left 0.3s",
        }),
      }}
    >
      <Toolbar sx={styles.toolbar}>
        {isMenuOpen ? (
          <CloseIcon sx={styles.menuIcon} onClick={handleMenuClick} />
        ) : (
          <MenuIcon sx={styles.menuIcon} onClick={handleMenuClick} />
        )}
        <Box sx={styles.logoContainer}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <CasinoIcon sx={{ color: "#E3BC3F" }} />{" "}
          </IconButton>
          <Typography variant="h6" sx={{ color: "#E3BC3F" }}>
            Games
          </Typography>
        </Box>
        <Box sx={styles.navLinks}>
          {/* Example nav links */}
          <Button
            sx={{
              ...styles.navLinkButton,
              ...(currentPage === "home" && styles.activeLink),
            }}
            onClick={() => handleLinkClick("home")}
          >
            Home
          </Button>
          <Button
            sx={{
              ...styles.navLinkButton,
              ...(currentPage === "about" && styles.activeLink),
            }}
            onClick={() => handleLinkClick("about")}
          >
            About Us
          </Button>
          <Button
            sx={{
              ...styles.navLinkButton,
              ...(currentPage === "games" && styles.activeLink),
            }}
            onClick={() => handleLinkClick("games")}
          >
            Games
          </Button>
          <Button
            sx={{
              ...styles.navLinkButton,
              ...(currentPage === "blog" && styles.activeLink),
            }}
          >
            Blogs
          </Button>
          <Button
            sx={{
              ...styles.navLinkButton,
              ...(currentPage === "contact" && styles.activeLink),
            }}
            onClick={() => handleLinkClick("contact")}
          >
            Contact
          </Button>
          {currentUser?.isAdmin ? (
            <Button
              sx={{
                ...styles.navLinkButton,
                ...(currentPage === "admin" && styles.activeLink),
              }}
              onClick={() => handleLinkClick("admin")}
            >
              Admin
            </Button>
          ) : null}
        </Box>
        <Box sx={styles.loginSignup}>
          {isAuthenticated ? (
            <Button sx={styles.loginBtn} onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button
                sx={styles.loginBtn}
                onClick={() => handleLinkClick("login")}
              >
                Login
              </Button>
              <Button sx={styles.signupBtn}>Signup</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
