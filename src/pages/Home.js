import { Box, Button, Typography } from "@mui/material";
import React, { useEffect } from "react";
import diceBg1 from "../assets/diceBackground2.webp";
import { useNavigate } from "react-router-dom";
import useMainStore from "../store/mainStore";

const styles = {
  container: {
    background: "black",
    color: "white",
  },
  sections: {
    minHeight: "400px",
  },
  section1: {
    backgroundImage: `url(${diceBg1})`,
    backgroundSize: "cover", // Cover the entire area of the container
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    padding: "0px",
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
const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setCurrentPage } = useMainStore();
  useEffect(() => {
    setCurrentPage("home");
  }, []);
  return (
    <Box sx={styles.container}>
      <Box sx={{ ...styles.section1, ...styles.sections }}>
        <Box
          sx={{
            background: "#00000090",
            width: "100%",
            height: "100%",
            margin: "0px",
          }}
        >
          <Box
            sx={{
              maxWidth: "450px",
              margin: "15% auto 10% 10%",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "goldenrod",
                fontSize: { sm: "2rem", md: "4rem" },
                fontWeight: "bold",
              }}
            >
              በቀላል ጨዋታዎች እየተዝናኑ የገንዘብ ሽልማቶችን ያሸንፉ!
            </Typography>
            <Typography variant="body2" sx={{ m: "20px 0" }}>
              ወደ ተለያዩ ጨዋታዎች ዓለም ዘልቀው ይግቡና ዳጎስ ባሉ የገንዘብ ሽልማቶች ይደሰቱ! በኦንላይን መዝናኛ
              እና በታላቅ እድሎች ምርጥ ጊዜ ያሳልፉ!
            </Typography>
            {isAuthenticated ? (
              <Button sx={styles.loginBtn} onClick={() => navigate("/games")}>
                Play
              </Button>
            ) : (
              <>
                <Button sx={styles.loginBtn} onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button
                  sx={styles.signupBtn}
                  onClick={() =>
                    navigate(`/login`, { state: { mode: "signup" } })
                  }
                >
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ ...styles.section2, ...styles.sections }}>Section2</Box>
      <Box sx={{ ...styles.section3, ...styles.sections }}>Section3</Box>
    </Box>
  );
};

export default Home;
