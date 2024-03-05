import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@mui/material";
import SecurityQuestionsModal from "../modals/SecurityQuestionsModal"; // Ensure this component is correctly implemented
import { useUserAuth } from "../context/AuthContext";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    width: "100%",
  },
  textField: {
    background: "white",
    border: "none",
  },
  actionButton: {
    marginBottom: "20px",
  },
  backButton: {
    marginTop: "10px",
    color: "white",
  },
  signupBtn: {
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

const Signup = ({ toggleMode }) => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { registerWithEmailPassword } = useUserAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userDetails.password !== passwordConfirm) {
      console.log("Passwords do not match");
      return;
    }
    try {
      const signupSuccess = await registerWithEmailPassword(userDetails);
      if (signupSuccess) {
        console.log("signup successfull.");
        toggleMode();
      } else {
        console.error("error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleModalSave = async (securityQuestions) => {
  //   // Include security questions into userDetails
  //   const completeUserDetails = { ...userDetails, securityQuestions };

  //   // Call saveUserData with complete user details
  //   try {
  //     const signupSuccess = await saveUserData(completeUserDetails);
  //     if (signupSuccess) {
  //       console.log("Signup and security questions saved successfully");
  //       // Reset state or redirect user as needed
  //       toggleMode(); // Example of redirecting user back to login
  //     } else {
  //       console.error("Error saving user data");
  //     }
  //   } catch (error) {
  //     console.error("Error during signup:", error);
  //   } finally {
  //     setModalOpen(false); // Ensure modal is closed after attempt to save data
  //   }
  // };

  return (
    <Box style={styles.container}>
      <h2 style={{ color: "white" }}>Signup</h2>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        {/* TextFields for firstName, lastName, and password */}
        <Box sx={styles.fieldContainer}>
          <EmailIcon sx={styles.icon} />
          <TextField
            label="Email"
            variant="filled"
            type="text"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            style={styles.textField}
            fullWidth
          />
        </Box>
        <Box sx={styles.fieldContainer}>
          <PersonIcon sx={styles.icon} />
          <TextField
            label="First Name"
            type="text"
            name="firstName"
            value={userDetails.firstName}
            onChange={handleChange}
            style={styles.textField}
            fullWidth
          />
        </Box>
        <Box sx={styles.fieldContainer}>
          <PersonIcon sx={styles.icon} />
          <TextField
            label="Last Name"
            type="text"
            name="lastName"
            value={userDetails.lastName}
            onChange={handleChange}
            style={styles.textField}
            fullWidth
          />
        </Box>
        <Box sx={styles.fieldContainer}>
          <KeyIcon sx={styles.icon} />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={userDetails.password}
            onChange={handleChange}
            style={styles.textField}
            fullWidth
          />
        </Box>
        <Box sx={styles.fieldContainer}>
          <KeyIcon sx={styles.icon} />
          <TextField
            label="Confirm Password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            style={styles.textField}
            fullWidth
          />
        </Box>
        <Button
          type="submit"
          disabled={!userDetails.password || !passwordConfirm}
          sx={styles.signupBtn}
        >
          Sign Up
        </Button>
      </form>
      <Button variant="text" onClick={toggleMode} style={styles.backButton}>
        Back to Login
      </Button>
    </Box>
  );
};

export default Signup;
