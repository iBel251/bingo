import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SecurityQuestionsModal from "../modals/SecurityQuestionsModal"; // Ensure this component is correctly implemented
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
  actionButton: {
    marginBottom: "20px",
  },
  backButton: {
    marginTop: "10px",
  },
};

const Signup = ({ toggleMode }) => {
  const [userDetails, setUserDetails] = useState({
    userId: "",
    firstName: "aaaa",
    lastName: "bbbb",
    password: "123456",
    securityQuestions: {},
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { saveUserData, checkUserIdExists } = useUserAuth();

  const generateAndCheckUserId = async () => {
    let idExists = true;
    let newId = "";
    while (idExists) {
      const potentialId = Math.floor(
        100000 + Math.random() * 900000
      ).toString(); // Generates a 6-digit random number
      const exists = await checkUserIdExists(potentialId);
      if (!exists) {
        newId = potentialId;
        idExists = false;
      }
    }
    setUserDetails((prevDetails) => ({ ...prevDetails, userId: newId }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userDetails.password !== passwordConfirm) {
      console.log("Passwords do not match");
      return;
    }
    setModalOpen(true); // Open modal to collect security questions
  };

  const handleModalSave = async (securityQuestions) => {
    // Include security questions into userDetails
    const completeUserDetails = { ...userDetails, securityQuestions };

    // Call saveUserData with complete user details
    try {
      const signupSuccess = await saveUserData(completeUserDetails);
      if (signupSuccess) {
        console.log("Signup and security questions saved successfully");
        // Reset state or redirect user as needed
        toggleMode(); // Example of redirecting user back to login
      } else {
        console.error("Error saving user data");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setModalOpen(false); // Ensure modal is closed after attempt to save data
    }
  };

  return (
    <div style={styles.container}>
      <h2>Signup</h2>
      <Button
        variant="contained"
        onClick={generateAndCheckUserId}
        style={styles.actionButton}
      >
        Generate User ID
      </Button>
      <form onSubmit={handleSubmit}>
        {/* TextFields for firstName, lastName, and password */}
        <TextField
          label="First Name"
          type="text"
          name="firstName"
          value={userDetails.firstName}
          onChange={handleChange}
          style={styles.textField}
          fullWidth
        />
        <TextField
          label="Last Name"
          type="text"
          name="lastName"
          value={userDetails.lastName}
          onChange={handleChange}
          style={styles.textField}
          fullWidth
        />
        <TextField
          label="User ID"
          type="text"
          value={userDetails.userId}
          style={styles.textField}
          fullWidth
          disabled
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={userDetails.password}
          onChange={handleChange}
          style={styles.textField}
          fullWidth
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          style={styles.textField}
          fullWidth
        />
        <Button
          variant="contained"
          type="submit"
          disabled={
            !userDetails.userId || !userDetails.password || !passwordConfirm
          }
        >
          Sign Up
        </Button>
      </form>
      <Button variant="text" onClick={toggleMode} style={styles.backButton}>
        Back to Login
      </Button>

      <SecurityQuestionsModal
        open={modalOpen}
        onSave={handleModalSave}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Signup;
