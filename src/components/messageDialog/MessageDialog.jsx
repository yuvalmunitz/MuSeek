// MessageDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Box
} from '@mui/material';
import { styled } from '@mui/system';

const DialogContainer = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#f5f5f5', // Light brownish background
    color: '#3e2723', // Deep brown color
  },
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#6d4c41', // Medium brown background
  color: theme.palette.common.white,
  padding: theme.spacing(2),
}));

const DialogBody = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const DialogFooter = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(1),
  justifyContent: 'space-between',
}));

export default function MessageDialog({ open, onClose, notification }) {
  return (
    <DialogContainer open={open} onClose={onClose}>
      <DialogHeader>{notification?.title}</DialogHeader>
      <DialogBody>
        <DialogContentText>
          {notification?.message}
        </DialogContentText>
        <Box mt={2}>
          <Typography variant="caption" color="textSecondary">
            {notification?.time}
          </Typography>
        </Box>
      </DialogBody>
      <DialogFooter>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{
            backgroundColor: '#6d4c41', // Medium brown background
            color: 'white',
            '&:hover': {
              backgroundColor: '#5d4037', // Darker brown on hover
            },
          }}
        >
          Close
        </Button>
      </DialogFooter>
    </DialogContainer>
  );
}