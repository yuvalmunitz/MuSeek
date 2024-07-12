// UploadDialog.jsx
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

export default function UploadDialog({ open, onClose, onUpload, fileType }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Upload ${fileType === 'pdf' ? 'PDF' : 'MP3'} File`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please select a {fileType === 'pdf' ? 'PDF' : 'MP3'} file to upload.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          type="file"
          fullWidth
          inputProps={{ accept: fileType === 'pdf' ? 'application/pdf' : 'audio/mp3' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onUpload} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}