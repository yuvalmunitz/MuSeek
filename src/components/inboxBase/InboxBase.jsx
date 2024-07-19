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
import AttachFileIcon from '@mui/icons-material/AttachFile';
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
  width: '80%',
  height: '80vh',
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
  maxHeight: '80%',
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

const notificationsData = [
  {
    id: '1',
    user: {
      id: 'user1',
      name: 'Emily Smith'
    },
    content: 'Emily loved your latest lyrics and suggested a new verse.',
    timestamp: '2024-07-17T10:00:00Z',
    type: 'New Reaction',
    isRead: false
  },
  {
    id: '2',
    user: {
      id: 'user2',
      name: 'David Brown'
    },
    content: 'David provided feedback on your song "Winds of Change." Check out the attached audio file.',
    timestamp: '2024-07-18T14:30:00Z',
    type: 'Lyrics Review',
    isRead: false,
    fileUrl: 'https://firebasestorage.googleapis.com/v0/b/museek-huji.appspot.com/o/posts%2F8zjLfzzJYibVAK82PCaOSGbTazm1%2Faudio_1721061900329.mp3?alt=media&token=20d12b1b-47bc-46d4-96f9-8682aadeb2d5'
  },
  {
    id: '3',
    user: {
      id: 'user3',
      name: 'Sarah Lee'
    },
    content: 'Sarah wants to collaborate on your song "Morning Dew." She has attached a PDF with her ideas.',
    timestamp: '2024-07-19T08:15:00Z',
    type: 'Collaboration Request',
    isRead: false,
    fileUrl: 'https://firebasestorage.googleapis.com/v0/b/museek-huji.appspot.com/o/posts%2F8zjLfzzJYibVAK82PCaOSGbTazm1%2Fpdf_1721239222609.pdf?alt=media&token=c774c307-38c0-4bdb-b363-959386a94733'
  },
  {
    id: '4',
    user: {
      id: 'system',
      name: 'System'
    },
    content: 'Your lyrics for "Echoes" have been approved.',
    timestamp: '2024-07-12T16:45:00Z',
    type: 'Lyrics Approved',
    isRead: true
  },
  {
    id: '5',
    user: {
      id: 'anonymous',
      name: 'Anonymous'
    },
    content: 'Someone commented on your song "Ocean Waves."',
    timestamp: '2024-07-16T11:20:00Z',
    type: 'New Comment',
    isRead: true
  }
];

export default function Inbox() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [mailDialogOpen, setMailDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  const handleDelete = (event, id) => {
    event.stopPropagation();
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleRead = (event, id) => {
    event.stopPropagation();
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
    return `${Math.floor(diffDays / 30)}m`;
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
                <Avatar style={{ backgroundColor: notification.isRead ? '#ccc' : '#6d4c41' }}>
                  <NotificationsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${notification.type}: ${notification.user.name}`}
                secondary={
                  <React.Fragment>
                    {formatDate(notification.timestamp)}
                    {notification.fileUrl && (
                      <Box component="span" ml={1}>
                        <AttachFileIcon fontSize="small" />
                      </Box>
                    )}
                  </React.Fragment>
                }
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
        <Dialog open={mailDialogOpen} onClose={handleMailDialogClose}>
          <DialogTitle>Send Response</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Responding to: {selectedNotification?.type}
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
            <StyledButton onClick={handleMailDialogClose}>
              Cancel
            </StyledButton>
            <StyledButton onClick={handleMailDialogClose}>
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