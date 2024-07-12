import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';

const InputField = styled(TextField)`
  margin-top: 10px;
  width: 100%;
  border-radius: 15;
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  margin: 30px 0;
  background-color: #e0dcd2; 
`;

export default function ReactionDialog({ open, onClose }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    // Handle the submit logic here, potentially sending the data to the backend
    console.log({ title, text, file });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth >
      <DialogTitle>Send a Reaction</DialogTitle>
      <DialogContent>
        <InputField
          fullWidth
          variant="outlined"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputField
          fullWidth
          variant="outlined"
          label="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={4}
        />
        <Box mt={2}>
          <Typography variant="body1">Upload a file</Typography>
          <input type="file" onChange={handleFileChange} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" style={{ backgroundColor: '#6d4c41', color: 'white' }}>
          Close
        </Button>
        <Button onClick={handleSubmit} style={{ backgroundColor: '#6d4c41', color: 'white' }} variant="contained">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}