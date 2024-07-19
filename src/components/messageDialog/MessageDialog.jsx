// import React, { useState, useRef } from 'react';
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Button,
//   Typography,
//   Box,
//   IconButton,
//   Link
// } from '@mui/material';
// import { styled } from '@mui/system';
// import CloseIcon from '@mui/icons-material/Close';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import AudiotrackIcon from '@mui/icons-material/Audiotrack';


// const DialogContainer = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialog-paper': {
//     backgroundColor: '#f5f5f5',
//     color: '#3e2723',
//     borderRadius: 10,
//     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//   },
// }));

// const DialogHeader = styled(DialogTitle)(({ theme }) => ({
//   backgroundColor: '#6d4c41',
//   color: '#ffffff',
//   padding: theme.spacing(2),
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
// }));

// const DialogBody = styled(DialogContent)(({ theme }) => ({
//   padding: theme.spacing(3),
// }));

// const DialogFooter = styled(DialogActions)(({ theme }) => ({
//   padding: theme.spacing(2),
//   justifyContent: 'flex-end',
// }));

// const CloseButton = styled(IconButton)(({ theme }) => ({
//   color: '#ffffff',
// }));

// const StyledButton = styled(Button)({
//   backgroundColor: '#6d4c41',
//   color: '#ffffff',
//   '&:hover': {
//     backgroundColor: '#5d4037',
//   },
// });

// const FileLink = styled(Link)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   color: '#6d4c41',
//   textDecoration: 'none',
//   marginTop: theme.spacing(2),
//   '&:hover': {
//     textDecoration: 'underline',
//   },
// }));

// const AudioPlayer = styled('audio')({
//   width: '100%',
//   marginTop: '10px',
// });

// const PdfViewer = styled('object')({
//   width: '100%',
//   height: '500px',
//   marginTop: '10px',
// });

// export default function MessageDialog({ open, onClose, notification }) {
//   const [isAudioPlaying, setIsAudioPlaying] = useState(false);
//   const [showPdfViewer, setShowPdfViewer] = useState(false);
//   const audioRef = useRef(null);

//   const handleAudioToggle = () => {
//     if (audioRef.current) {
//       if (isAudioPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play();
//       }
//       setIsAudioPlaying(!isAudioPlaying);
//     }
//   };

//   const handlePdfToggle = () => {
//     setShowPdfViewer(!showPdfViewer);
//   };

//   const renderFileAttachment = () => {
//     if (!notification || !notification.fileUrl) return null;

//     const fileExtension = notification.fileUrl.split('.').pop().split('?')[0].toLowerCase();
//     const isAudio = fileExtension === 'mp3' || fileExtension === 'hb3';
//     const isPdf = fileExtension === 'pdf';

//     if (isAudio || isPdf) {
//       return (
//         <Box mt={2}>
//           <Typography variant="subtitle2" gutterBottom>
//             Attachment:
//           </Typography>
//           <FileLink 
//             href="#" 
//             onClick={(e) => {
//               e.preventDefault();
//               isAudio ? handleAudioToggle() : handlePdfToggle();
//             }}
//           >
//             {isAudio ? <AudiotrackIcon sx={{ mr: 1 }} /> : <PictureAsPdfIcon sx={{ mr: 1 }} />}
//             {isAudio ? (isAudioPlaying ? 'Pause Audio' : 'Play Audio') : (showPdfViewer ? 'Hide PDF' : 'View PDF')}
//           </FileLink>
//           {isAudio && (
//             <AudioPlayer
//               ref={audioRef}
//               src={notification.fileUrl}
//               controls
//               onPlay={() => setIsAudioPlaying(true)}
//               onPause={() => setIsAudioPlaying(false)}
//               onEnded={() => setIsAudioPlaying(false)}
//             />
//           )}
//           {isPdf && showPdfViewer && (
//             <PdfViewer data={notification.fileUrl} type="application/pdf">
//               <Typography>
//                 It appears your browser doesn't support embedded PDFs. 
//                 You can <Link href={notification.fileUrl} target="_blank" rel="noopener noreferrer">download the PDF</Link> to view it.
//               </Typography>
//             </PdfViewer>
//           )}
//         </Box>
//       );
//     }
//     return null;
//   };

//   if (!notification) return null;

//   return (
//     <DialogContainer open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogHeader>
//         <Typography variant="h6">{notification.type}</Typography>
//         <CloseButton aria-label="close" onClick={onClose}>
//           <CloseIcon />
//         </CloseButton>
//       </DialogHeader>
//       <DialogBody>
//         <Typography variant="subtitle1" gutterBottom>
//           From: {notification.user.name}
//         </Typography>
//         <DialogContentText color="textPrimary">
//           {notification.content}
//         </DialogContentText>
//         {renderFileAttachment()}
//         <Box mt={2}>
//           <Typography variant="caption" color="textSecondary">
//             {new Date(notification.timestamp).toLocaleString()}
//           </Typography>
//         </Box>
//       </DialogBody>
//       <DialogFooter>
//         <StyledButton onClick={onClose} variant="contained">
//           Close
//         </StyledButton>
//       </DialogFooter>
//     </DialogContainer>
//   );
// }


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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

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
  justifyContent: 'flex-end',
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
  alignItems: 'center',
  marginTop: '20px',
});

const PdfViewer = styled('object')({
  width: '100%',
  height: '500px',
  marginTop: '10px',
});

export default function MessageDialog({ open, onClose, notification }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (notification && notification.fileUrl) {
      audioRef.current.src = notification.fileUrl;
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
    }

    return () => {
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('ended', handleEnded);
      audioRef.current.pause();
      setIsPlaying(false);
    };
  }, [notification]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
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

  const renderFileAttachment = () => {
    if (!notification || !notification.fileUrl) return null;

    const fileExtension = notification.fileUrl.split('.').pop().split('?')[0].toLowerCase();
    const isAudio = fileExtension === 'mp3' || fileExtension === 'hb3';
    const isPdf = fileExtension === 'pdf';

    if (isAudio) {
      return (
        <AudioPlayerContainer>
          <IconButton onClick={handlePlayPause} size="large">
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ ml: 2, color: '#3e2723' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
        </AudioPlayerContainer>
      );
    } else if (isPdf) {
      return (
        <Box mt={2}>
          <Button
            startIcon={<PictureAsPdfIcon />}
            onClick={handlePdfToggle}
          >
            {showPdfViewer ? 'Hide PDF' : 'View PDF'}
          </Button>
          {showPdfViewer && (
            <PdfViewer data={notification.fileUrl} type="application/pdf">
              <Typography>
                It appears your browser doesn't support embedded PDFs. 
                You can <Link href={notification.fileUrl} target="_blank" rel="noopener noreferrer">download the PDF</Link> to view it.
              </Typography>
            </PdfViewer>
          )}
        </Box>
      );
    }
    return null;
  };

  if (!notification) return null;

  return (
    <DialogContainer open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogHeader>
        <Typography variant="h6">{notification.type}</Typography>
        <CloseButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </DialogHeader>
      <DialogBody>
        <Typography variant="subtitle1" gutterBottom>
          From: {notification.user.name}
        </Typography>
        <DialogContentText color="textPrimary">
          {notification.content}
        </DialogContentText>
        {renderFileAttachment()}
        <Box mt={2}>
          <Typography variant="caption" color="textSecondary">
            {new Date(notification.timestamp).toLocaleString()}
          </Typography>
        </Box>
      </DialogBody>
      <DialogFooter>
        <StyledButton onClick={onClose} variant="contained">
          Close
        </StyledButton>
      </DialogFooter>
    </DialogContainer>
  );
}