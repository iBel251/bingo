import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const questions = [
  "የምትደግፈው የእግር ኳስ ቡድን?",
  "የእናት ስም?",
  "የትውልድ ሰፈር?",
  "የመጀመሪያ ደረጃ ት/ቤት ስም?",
  "የምቶዱት የቀለም አይነት?",
];

const SecurityQuestionsModal = ({ open, onClose, onSave }) => {
  const [selectedQuestion1, setSelectedQuestion1] = useState("");
  const [selectedQuestion2, setSelectedQuestion2] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [canSave, setCanSave] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedQuestion1 && selectedQuestion2 && answer1 && answer2) {
      setCanSave(true);
    } else {
      setCanSave(false);
    }
  }, [selectedQuestion1, selectedQuestion2, answer1, answer2]);

  const handleSave = async () => {
    setLoading(true);
    const securityQuestions = {
      [selectedQuestion1]: answer1,
      [selectedQuestion2]: answer2,
    };
    await onSave(securityQuestions);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Security Questions</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Question 1</InputLabel>
          <Select
            value={selectedQuestion1}
            label="Question 1"
            onChange={(e) => setSelectedQuestion1(e.target.value)}
          >
            {questions
              .filter((question) => question !== selectedQuestion2)
              .map((question, index) => (
                <MenuItem key={index} value={question}>
                  {question}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          id="answer1"
          label="Answer 1"
          fullWidth
          variant="standard"
          value={answer1}
          onChange={(e) => setAnswer1(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Question 2</InputLabel>
          <Select
            value={selectedQuestion2}
            label="Question 2"
            onChange={(e) => setSelectedQuestion2(e.target.value)}
          >
            {questions
              .filter((question) => question !== selectedQuestion1)
              .map((question, index) => (
                <MenuItem key={index} value={question}>
                  {question}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          id="answer2"
          label="Answer 2"
          fullWidth
          variant="standard"
          value={answer2}
          onChange={(e) => setAnswer2(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={!canSave} onClick={handleSave}>
          {!loading ? "Save" : <CircularProgress />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SecurityQuestionsModal;
