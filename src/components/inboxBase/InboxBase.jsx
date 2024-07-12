import React, { useState } from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import { styled } from '@mui/system';
import MessageDialog from '../messageDialog/MessageDialog';

const BackgroundContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#e0dcd2', // Light brown background
}));

const NotificationsContainer = styled(Paper)(({ theme }) => ({
  width: '80%', // Make it take up half the screen width
  height: '80vh', // Make it take up half the screen height
  borderRadius: 10,
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  backgroundColor: '#f5f5f5', // Light brownish background
  color: '#3e2723', // Deep brown color
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: '#6d4c41', // Medium brown background
  color: theme.palette.common.white,
}));

const NotificationList = styled(List)(({ theme }) => ({
  maxHeight: '80%', // Adjust height to fit container
  overflowY: 'auto',
}));

const NotificationItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));
const notificationsData = [
  { id: 1, title: 'New Reaction: Emily Smith', message: 'Emily loved your latest lyrics and suggested a new verse.', time: '2d', read: false },
  { id: 2, title: 'Lyrics Review: David Brown', message: 'David provided feedback on your song "Winds of Change."', time: '1d', read: false },
  { id: 3, title: 'Collaboration Request: Sarah Lee', message: 'Sarah wants to collaborate on your song "Morning Dew."', time: '4h', read: false },
  { id: 4, title: 'Lyrics Approved: "Echoes"', message: 'Your lyrics for "Echoes" have been approved.', time: '1w', read: true },
  { id: 5, title: 'New Comment: "Ocean Waves"', message: 'Someone commented on your song "Ocean Waves."', time: '3d', read: true },
  { id: 6, title: 'Melody Suggestion: Mark Johnson', message: 'Mark suggested a melody for your song "Starlight."', time: '5d', read: false },
  { id: 7, title: 'Song Entry: "Whispers"', message: 'Your song "Whispers" has been entered into the contest.', time: '6h', read: false },
  { id: 8, title: 'Feedback: "Silent Dreams"', message: 'You received feedback on "Silent Dreams."', time: '2h', read: false },
  { id: 9, title: 'Lyrics Updated: "Sunrise"', message: 'Your lyrics for "Sunrise" have been updated successfully.', time: '1w', read: true },
  { id: 10, title: 'Review Request: "Moonlight"', message: 'You have a new request to review the song "Moonlight."', time: '3w', read: false },
  { id: 11, title: 'Melody Idea: "Raindrops"', message: 'Check out this new melody idea for "Raindrops."', time: '7h', read: false },
  { id: 12, title: 'Collab Approved: "Harmony"', message: 'Your collaboration request for "Harmony" has been approved.', time: '4d', read: true },
  { id: 13, title: 'Lyrics Published: "Heartbeats"', message: 'Your lyrics for "Heartbeats" have been published successfully.', time: '1h', read: false },
  { id: 14, title: 'New Submission: "Mystery"', message: 'You have a new lyrics submission titled "Mystery" to review.', time: '3d', read: false },
  { id: 15, title: 'Recording Scheduled: "Dreamscape"', message: 'Your recording for "Dreamscape" is scheduled for tomorrow.', time: '30m', read: false },
];



const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#6d4c41',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#6d4c41',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#6d4c41',
    },
    '&:hover fieldset': {
      borderColor: '#5d4037',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6d4c41',
    },
  },
});

const StyledButton = styled(Button)({
  backgroundColor: '#6d4c41',
  color: 'white',
  '&:hover': {
    backgroundColor: '#5d4037',
  },
});


export default function Inbox() {
  const [open, setOpen] = React.useState(true);
  const [notifications, setNotifications] = useState(notificationsData);
  const [mailDialogOpen, setMailDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (event, id) => {
    event.stopPropagation();
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleRead = (event, id) => {
    event.stopPropagation();
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleRespond = (event, notification) => {
    event.stopPropagation();
    setSelectedNotification(notification);
    setMailDialogOpen(true);
  };

  const handleMailDialogClose = () => {
    setMailDialogOpen(false);
    setSelectedNotification(null);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setMessageDialogOpen(true);
  };

  const handleMessageDialogClose = () => {
    setMessageDialogOpen(false);
    setSelectedNotification(null);
  };

  return (
    <BackgroundContainer>
      <NotificationsContainer>
        <NotificationHeader>
          <Typography variant="h6">Reactions</Typography>
        </NotificationHeader>
        <NotificationList>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} button onClick={() => handleNotificationClick(notification)}>
              <ListItemAvatar>
                <Avatar style={{ backgroundColor: notification.read ? '#ccc' : '#6d4c41' }}>
                  <NotificationsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={notification.title}
                secondary={notification.time}
              />
              <Box>
                <IconButton onClick={(event) => handleDelete(event, notification.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={(event) => handleRead(event, notification.id)}>
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={(event) => handleRespond(event, notification)}>
                  <EmailIcon />
                </IconButton>
              </Box>
            </NotificationItem>
          ))}
        </NotificationList>
        <Box p={1} textAlign="center">
          <Typography variant="caption" color="textSecondary">
            MuSeek
          </Typography>
        </Box>
        <Dialog open={mailDialogOpen} onClose={handleMailDialogClose} >
          <DialogTitle>Send Response</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Responding to: {selectedNotification?.title}
            </DialogContentText>
            <StyledTextField
              autoFocus
              margin="dense"
              label="Your Message"
              type="text"
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={handleMailDialogClose} >
              Cancel
            </StyledButton>
            <StyledButton onClick={handleMailDialogClose} >
              Send
            </StyledButton>
          </DialogActions>
        </Dialog>
        <MessageDialog
          open={messageDialogOpen}
          onClose={handleMessageDialogClose}
          notification={selectedNotification}
        />
      </NotificationsContainer>
    </BackgroundContainer>
  );
}