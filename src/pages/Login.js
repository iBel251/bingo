import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import Signup from "./Signup";
import { useUserAuth } from "../context/AuthContext";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "50px auto",
    width: "300px",
  },
  textField: {
    marginBottom: "20px",
  },
  toggleButton: {
    marginTop: "20px",
  },
};

const Login = () => {
  const [id, setId] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [password, setPassword] = useState(""); // Add this line
  const { authenticateUser } = useUserAuth();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use verifyUser here
    const {isValidUser,isAdmin} = await authenticateUser(id, password);
    if (isValidUser) {
      setMessage("Login Successful");
      // Proceed with login success logic
    } else {
      setMessage("Incorrect credentials, please try again.");
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
  };

  return (
    <div style={styles.container}>
      {isSignupMode ? (
        <Signup toggleMode={toggleMode} />
      ) : (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="user ID"
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
              style={styles.textField}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.textField}
              fullWidth
            />
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
            <Button variant="contained" type="submit">
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
    </div>
  );
};

export default Login;
