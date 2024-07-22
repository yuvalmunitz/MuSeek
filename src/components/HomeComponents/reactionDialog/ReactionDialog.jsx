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
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '../../../firestore/AuthContext';
import { addCommentToPost } from '../../../firestore/users';

const InputField = styled(TextField)`
  margin-top: 10px;
  width: 100%;
  border-radius: 15px;
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  margin: 30px 0;
  background-color: #e0dcd2;
`;

export default function ReactionDialog({ open, onClose, postId }) {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('audio/')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF or MP3 file.');
        setFile(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !text.trim()) {
      setError('Please fill in both title and text fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const commentData = {
        title,
        text,
        userId: currentUser.uid,
        username: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
        createdAt: new Date(),
      };

      if (file) {
        commentData.file = file;
        commentData.fileName = file.name;
        commentData.fileType = file.type;
      }

      await addCommentToPost(postId, commentData);
      onClose();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(`Failed to add comment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Send a Reaction</DialogTitle>
        <DialogContent>
          <InputField
              fullWidth
              variant="outlined"
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
          />
          <InputField
              fullWidth
              variant="outlined"
              label="Text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              multiline
              rows={4}
              disabled={isLoading}
          />
          <Box mt={2}>
            <Typography variant="body1">Upload a file (PDF or MP3)</Typography>
            <input
                type="file"
                onChange={handleFileChange}
                disabled={isLoading}
                accept=".pdf,audio/*"
            />
            {file && (
                <Typography variant="body2">
                  Selected file: {file.name}
                </Typography>
            )}
          </Box>
          {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" style={{ backgroundColor: '#6d4c41', color: 'white' }} disabled={isLoading}>
            Close
          </Button>
          <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#6d4c41', color: 'white' }}
              variant="contained"
              disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>
  );
}