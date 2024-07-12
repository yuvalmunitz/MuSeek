import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { CloudUpload, Close } from '@mui/icons-material';

const StyledButton = styled(Button)({
  backgroundColor: '#6d4c41',
  color: 'white',
  '&:hover': {
    backgroundColor: '#5d4037',
  },
});

const UploadDialog = ({ open, onClose, onUpload, fileType }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload {fileType === 'pdf' ? 'PDF' : 'MP3'}</DialogTitle>
      <DialogContent>
        <input
          accept={fileType === 'pdf' ? 'application/pdf' : 'audio/mp3'}
          style={{ display: 'none' }}
          id="upload-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-file">
          <StyledButton variant="contained" component="span" startIcon={<CloudUpload />}>
            Choose File
          </StyledButton>
        </label>
        {file && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Selected file: {file.name}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} startIcon={<Close />}>
          Cancel
        </StyledButton>
        <StyledButton onClick={handleUpload} startIcon={<CloudUpload />}>
          Upload
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;

