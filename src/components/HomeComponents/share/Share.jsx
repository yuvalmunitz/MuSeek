import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import NotesIcon from '@mui/icons-material/Notes';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Slider, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useAuth } from '../../../firestore/AuthContext';
import { addPostToUser } from '../../../firestore/users';
import { serverTimestamp } from 'firebase/firestore';



const ShareWrapper = styled.div`
  padding: 10px;
`;

const ShareTop = styled.div`
  display: flex;
  align-items: center;
`;

const ShareProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;
const ShareInput = styled.input`
  border: none;
  width: 80%;
  font-size: 16px;
  background-color: #e0dcd2;  // This matches the ShareContainer background color
  color: #3e2723;  // Dark brown text color for better contrast
  padding: 10px;
  border-radius: 5px;

  &:focus {
    outline: none;
    background-color: #d7ccc8;  // Slightly darker when focused for visual feedback
  }

  &::placeholder {
    color: #8d6e63;  // Light brown color for the placeholder text
  }
`;

const ShareHr = styled.hr`
  margin: 20px;
`;

const ShareBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ShareOptions = styled.div`
  display: flex;
  margin-left: 20px;
`;

const ShareOption = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
  cursor: pointer;
`;

const ShareButton = styled.button`
  border: none;
  padding: 7px;
  border-radius: 5px;
  background-color: #6d4c41; /* Medium brown background */
  font-weight: 500;
  margin-right: 20px;
  cursor: pointer;
  color: white;
`;
const ShareContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  margin: 30px 0;
  background-color: #e0dcd2; 
`;
  
const AudioPlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const StyledSlider = styled(Slider)({
  color: '#6d4c41',
  '& .MuiSlider-thumb': {
    backgroundColor: '#5d4037',
  },
  '& .MuiSlider-track': {
    backgroundColor: '#5d4037',
  },
  '& .MuiSlider-rail': {
    backgroundColor: '#d7ccc8',
  },
});

const StyledButton = styled(Button)({
  backgroundColor: '#6d4c41',
  color: 'white',
  '&:hover': {
    backgroundColor: '#5d4037',
  },
  margin: '0 10px',
});

const StyledDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    background-color: #6d4c41;
    color: white;
  }

  .MuiDialogContent-root {
    padding: 24px;
  }

  .MuiDialogActions-root {
    padding: 16px;
  }
`;

const PDFContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  color: white;
`;

export default function Share({ onPostAdded }) {
  const { currentUser } = useAuth();
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);

  useEffect(() => {
    let audio;
    if (audioUrl) {
      audio = new Audio(audioUrl);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [audioUrl]);

  const handleShare = async () => {
    try {
      const newPost = {
        desc: description,
        audio: audioFile, // Keep this as File for upload
        pdf: pdfFile, // Keep this as File for upload
        username: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
        likes: 0,
        comments: 0,
        date: serverTimestamp()
      };

      // Add the post to Firestore and user's posts array
      const postId = await addPostToUser(currentUser.uid, newPost);

      // Clear the form
      setDescription('');
      setAudioFile(null);
      setAudioUrl(null);
      setPdfFile(null);
      setPdfUrl(null);
      // ... (reset other state variables)

      // Notify parent component that a new post was added
      if (onPostAdded) {
        onPostAdded({
          id: postId,
          desc: description,
          audio: audioUrl, // Use URL for rendering
          pdf: pdfUrl, // Use URL for rendering
          username: currentUser.displayName,
          userPhotoURL: currentUser.photoURL,
          likes: 0,
          comments: 0,
          date: new Date().toLocaleString()
        });
      }

      console.log('Post shared successfully');
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };


  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handlePdfUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setPdfDialogOpen(true);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handlePlayPause = () => {
    const audio = new Audio(audioUrl);
    if (isPlaying) {
      audio.pause();
    } else {
      audio.currentTime = currentTime;
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  const handleSliderChange = (_, newValue) => {
    const audio = new Audio(audioUrl);
    audio.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleClosePdfDialog = () => {
    setPdfDialogOpen(false);
  };

  return (
    <ShareContainer>
      <ShareWrapper>
        <ShareTop>
          <ShareProfileImg src={currentUser.photoURL} alt={currentUser.displayName} />
          <ShareInput
            placeholder={`What's on your mind, ${currentUser.displayName}?`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </ShareTop>
        <ShareHr />
        <ShareBottom>
          <ShareOptions>
            <ShareOption>
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="pdf-upload"
                type="file"
                onChange={handlePdfUpload}
              />
              <label htmlFor="pdf-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<NotesIcon />}
                  style={{ backgroundColor: '#6d4c41', color: 'white', marginRight: '10px' }}
                >
                  Upload Lyrics (PDF)
                </Button>
              </label>
            </ShareOption>
            <ShareOption>
              <input
                accept="audio/*"
                style={{ display: 'none' }}
                id="audio-upload"
                type="file"
                onChange={handleAudioUpload}
              />
              <label htmlFor="audio-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<MusicNoteIcon />}
                  style={{ backgroundColor: '#6d4c41', color: 'white' }}
                >
                  Upload Audio
                </Button>
              </label>
            </ShareOption>
          </ShareOptions>
          <ShareButton onClick={handleShare}>Share</ShareButton>
        </ShareBottom>
        {audioUrl && (
          <AudioPlayerContainer>
            <StyledButton onClick={handlePlayPause} variant="contained">
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </StyledButton>
            <StyledSlider
              value={currentTime}
              max={duration}
              onChange={handleSliderChange}
              aria-labelledby="continuous-slider"
              sx={{ width: '80%', mt: 2 }}
            />
            <Typography variant="body2" sx={{ color: '#3e2723', mt: 1 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </AudioPlayerContainer>
        )}
      </ShareWrapper>
      <StyledDialog
        open={pdfDialogOpen}
        onClose={handleClosePdfDialog}
        maxWidth="md"
        fullWidth
        aria-labelledby="pdf-dialog-title"
      >
        <DialogTitle id="pdf-dialog-title">
          PDF Viewer
          <CloseButton
            aria-label="close"
            onClick={handleClosePdfDialog}
          >
            <CloseIcon />
          </CloseButton>
        </DialogTitle>
        <DialogContent dividers>
          {pdfFile ? (
            <PDFContainer>
              <iframe 
                src={pdfFile} 
                width="100%" 
                height="600px" 
                style={{ border: 'none' }}
                title="PDF Viewer"
              />
            </PDFContainer>
          ) : (
            <div style={{ marginTop: '16px', color: '#6d4c41' }}>
              No PDF uploaded yet.
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePdfDialog} style={{ backgroundColor: '#6d4c41', color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
    </ShareContainer>
  );
}