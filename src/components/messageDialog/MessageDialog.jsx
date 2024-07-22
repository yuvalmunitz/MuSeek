import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  Box,
  IconButton,
  Link
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';

const DialogContainer = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#f5f5f5',
    color: '#3e2723',
    borderRadius: 10,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#6d4c41',
  color: '#ffffff',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const DialogBody = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const DialogFooter = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  justifyContent: 'space-between',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: '#ffffff',
}));

const StyledButton = styled(Button)({
  backgroundColor: '#6d4c41',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#5d4037',
  },
});

const AudioPlayerContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '20px',
});

const PdfViewer = styled('iframe')({
  width: '100%',
  height: '500px',
  border: 'none',
  marginTop: '10px',
});

export default function MessageDialog({ open, onClose, notification, onDelete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [fileType, setFileType] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (notification && notification.fileUrl) {
      const url = notification.fileUrl;
      console.log("File URL:", url);  // Debugging line

      // Determine file type
      if (url.includes('.mp3') || url.includes('.hb3') || url.includes('.wav') || url.includes('.ogg')) {
        setFileType('audio');
      } else if (url.includes('.pdf')) {
        setFileType('pdf');
      } else {
        setFileType('unknown');
      }

      if (fileType === 'audio') {
        audioRef.current = new Audio(url);
        audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.addEventListener('ended', handleEnded);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, [notification, fileType]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePdfToggle = () => {
    setShowPdfViewer(!showPdfViewer);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'posts', notification.postId, 'comments', notification.id));
      onDelete(notification.id);
      onClose();
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const handleMailTo = () => {
    window.location.href = `mailto:${notification.user?.email || ''}?subject=Re: ${notification.type}`;
  };

  if (!notification) return null;

  console.log("Notification:", notification);  // Debugging line
  console.log("File type:", fileType);  // Debugging line

  return (
      <DialogContainer open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogHeader>
          {notification.type}
          <CloseButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </DialogHeader>
        <DialogBody>
          <Typography variant="subtitle1" gutterBottom>
            From: {notification.user?.name || 'Unknown User'}
          </Typography>
          <DialogContentText color="textPrimary">
            {notification.content}
          </DialogContentText>
          {fileType === 'audio' && (
              <AudioPlayerContainer>
                <StyledButton onClick={handlePlayPause} variant="contained" startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}>
                  {isPlaying ? 'Pause' : 'Play'} Audio
                </StyledButton>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
              </AudioPlayerContainer>
          )}
          {fileType === 'pdf' && (
              <Box mt={2}>
                <StyledButton onClick={handlePdfToggle} variant="contained" startIcon={<PictureAsPdfIcon />}>
                  {showPdfViewer ? 'Hide PDF' : 'View PDF'}
                </StyledButton>
                {showPdfViewer && (
                    <PdfViewer
                        src={notification.fileUrl}
                        title="PDF Viewer"
                    />
                )}
              </Box>
          )}
          {fileType === 'unknown' && notification.fileUrl && (
              <Box mt={2}>
                <Typography variant="body2">
                  Unrecognized file type. <Link href={notification.fileUrl} target="_blank" rel="noopener noreferrer">Click here to download</Link>
                </Typography>
              </Box>
          )}
          <Box mt={2}>
            <Typography variant="caption" color="textSecondary">
              {notification.timestamp ? new Date(notification.timestamp.seconds * 1000).toLocaleString() : 'Unknown date'}
            </Typography>
          </Box>
        </DialogBody>
        <DialogFooter>
          <Box>
            <IconButton onClick={handleDelete} color="error">
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={handleMailTo} color="primary">
              <EmailIcon />
            </IconButton>
          </Box>
          <StyledButton onClick={onClose}>
            Close
          </StyledButton>
        </DialogFooter>
      </DialogContainer>
  );
}