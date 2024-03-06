import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import Signup from "./Signup";
import { useUserAuth } from "../context/AuthContext";
import bg1 from "../assets/bg2.jpg";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import useMainStore from "../store/mainStore";
import { useLocation, useNavigate } from "react-router-dom";

const styles = {
  background: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)),url(${bg1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    width: "90%",
    height: "90%",
    maxWidth: "400px", // Adjust this value to increase the form size
  },
  textField: {
    background: "white",
    border: "none",
  },
  toggleButton: {
    marginTop: "20px",
    color: "white",
  },
  loginBtn: {
    width: "100%",
    height: "50px",
    color: "black",
    background: "goldenrod",
    marginRight: "5px",
    borderRadius: "0px",
    "&:hover": { background: "gold" },
  },
  fieldContainer: {
    display: "flex",
    marginBottom: "10px",
  },
  icon: {
    color: "black",
    background: "goldenrod",
    fontSize: "30px",
    padding: "13px",
  },
};

const Login = () => {
  const [id, setId] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [password, setPassword] = useState(""); // Add this line
  const { loginWithEmailPassword } = useUserAuth();
  const [message, setMessage] = useState("");
  const { login, setHeadTo } = useMainStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.mode === "signup") {
      setIsSignupMode(true);
    } else {
      setIsSignupMode(false);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use verifyUser here
    const result = await loginWithEmailPassword(id, password);
    if (result.success) {
      setMessage("Login Successful");
      console.log("user: ", result.user);
      console.log("userdata: ", result.userData);
      login(result.user, result.userData);
    } else {
      console.log(result);
      setMessage("Incorrect credentials, please try again.");
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
  };

  return (
    <Box style={styles.background}>
      <Button
        sx={{
          background: "goldenrod",
          color: "black",
          border: "1px solid goldenrod",
          "&:hover": { color: "goldenrod", background: "black" },
        }}
        onClick={() => navigate("/")}
      >
        Home
      </Button>
      <Box style={styles.container}>
        {isSignupMode ? (
          <Signup toggleMode={toggleMode} />
        ) : (
          <>
            <h2 style={{ color: "white" }}>Login</h2>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <Box sx={styles.fieldContainer}>
                <PersonIcon sx={styles.icon} />
                <TextField
                  label="Email"
                  variant="filled"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  style={styles.textField}
                  fullWidth
                />
              </Box>
              <Box sx={styles.fieldContainer}>
                <LockIcon sx={styles.icon} />
                <TextField
                  label="Password"
                  variant="filled"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.textField}
                  fullWidth
                />
              </Box>
              {message ? (
                <Box
                  sx={{
                    border: "1px solid red",
                    padding: "10px",
                    marginBottom: "20px",
                    background: "#FF000020",
                    color: "#FF000090",
                  }}
                >
                  {message}
                </Box>
              ) : null}
              <Button variant="contained" type="submit" sx={styles.loginBtn}>
                Login
              </Button>
            </form>
            <Button
              variant="text"
              onClick={toggleMode}
              style={styles.toggleButton}
            >
              Don't have an account? Sign up
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Login;
