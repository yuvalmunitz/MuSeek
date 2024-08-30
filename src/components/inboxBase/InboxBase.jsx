import React, { useState, useEffect } from 'react';
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
  TextField,
  CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { styled } from '@mui/system';
import MessageDialog from '../messageDialog/MessageDialog';
import { collection, query, where, onSnapshot, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../firestore/AuthContext';

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
  maxHeight: 'calc(80vh - 48px)', // Subtract the header height
  overflowY: 'auto',
}));

const NotificationItem = styled(ListItem)(({ theme, isRead }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: isRead ? 'transparent' : '#e8e0d8', // Light beige for unread notifications
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

export default function InboxBase() {
  const [notifications, setNotifications] = useState([]);
  const [mailDialogOpen, setMailDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchNotifications = async () => {
        setLoading(true);
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', currentUser.uid)
        );
        const postSnapshots = await getDocs(postsQuery);

        const unsubscribes = [];

        postSnapshots.forEach((postDoc) => {
          const commentsQuery = query(
            collection(db, 'posts', postDoc.id, 'comments'),
            orderBy('createdAt', 'desc')
          );

          const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
            const newComments = snapshot.docs.map(doc => ({
              id: doc.id,
              postId: postDoc.id,
              ...doc.data(),
              title: doc.data().title || 'New Comment'  // Use the comment title or default to "New Comment"
            }));
            
            setNotifications(prevNotifications => {
              const updatedNotifications = prevNotifications.filter(
                notification => notification.postId !== postDoc.id
              );
              return [...updatedNotifications, ...newComments];
            });
            
            setLoading(false);
          });

          unsubscribes.push(unsubscribe);
        });

        return () => unsubscribes.forEach(unsubscribe => unsubscribe());
      };

      fetchNotifications();
    }
  }, [currentUser]);

  const handleDelete = async (event, notificationId, postId) => {
    event.stopPropagation();
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteDoc(doc(db, 'posts', postId, 'comments', notificationId));
      // We don't need to manually update the state here anymore
      // as the onSnapshot listener will catch this change
    } catch (error) {
      console.error("Error deleting comment: ", error);
      setDeleteError("Failed to delete the notification. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRead = async (event, notificationId, postId) => {
    event.stopPropagation();
    try {
      await updateDoc(doc(db, 'posts', postId, 'comments', notificationId), {
        isRead: true
      });
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMailTo = (event, notification) => {
    event.stopPropagation();
    // Use the comment author's email if available, otherwise fallback to test@gmail.com
    const email = notification.email || notification.userEmail || 'test@gmail.com';
    const subject = encodeURIComponent(`Re: ${notification.title}`);
    const body = encodeURIComponent(`Regarding your comment: "${notification.text}"`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
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

  const formatNotificationForDialog = (notification) => {
    return {
      id: notification.id,
      type: notification.title,  // Use the title here instead of type
      user: {
        name: notification.username,
        id: notification.userId,
        email: notification.email
      },
      content: notification.text,
      timestamp: notification.createdAt,
      fileUrl: notification.fileUrl,
      postId: notification.postId
    };
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(formatNotificationForDialog(notification));
    setMessageDialogOpen(true);
  };

  const handleMessageDialogClose = () => {
    setMessageDialogOpen(false);
    setSelectedNotification(null);
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return '';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffTime = now - date;
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
  
    // Check if it's today
    if (diffDays === 0) {
      if (diffSeconds < 60) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      return `${diffHours}h ago`;
    }
  
    // Check if it's yesterday
    if (diffDays === 1) return 'Yesterday';
  
    // For older dates
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  return (
    <BackgroundContainer>
      <NotificationsContainer>
        <NotificationHeader>
          <Typography variant="h6">Reactions</Typography>
        </NotificationHeader>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <NotificationList>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  isRead={notification.isRead}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <NotificationsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Title: ${notification.title}`}  // Display the title here
                    secondary={
                      <React.Fragment>
                        {`Author: ${notification.username}`}
                        <br />
                        {formatDate(notification.createdAt)}
                        {notification.fileUrl && (
                          <Box component="span" ml={1}>
                            <AttachFileIcon fontSize="small" />
                          </Box>
                        )}
                      </React.Fragment>
                    }
                  />
                  <IconButton onClick={(event) => handleDelete(event, notification.id, notification.postId)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={(event) => handleRead(event, notification.id, notification.postId)}>
                    <CheckIcon />
                  </IconButton>
                  <IconButton onClick={(event) => handleMailTo(event, notification)}>
                    <EmailIcon />
                  </IconButton>
                </NotificationItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" align="center">
                No notifications available
              </Typography>
            )}
          </NotificationList>
        )}
      </NotificationsContainer>
      <MessageDialog
        open={messageDialogOpen}
        onClose={handleMessageDialogClose}
        notification={selectedNotification}
      />
      <Dialog open={mailDialogOpen} onClose={handleMailDialogClose}>
        <DialogTitle>Respond to {selectedNotification?.username}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write your message below to respond to {selectedNotification?.username}.
          </DialogContentText>
          <StyledTextField
            autoFocus
            margin="dense"
            label="Message"
            fullWidth
            multiline
            rows={4}
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
    </BackgroundContainer>
  );
}
