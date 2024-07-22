import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import NotesIcon from '@mui/icons-material/Notes';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import CloseIcon from '@mui/icons-material/Close';
import { 
  Button, 
  Slider, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
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
  background-color: #e0dcd2;
  color: #3e2723;
  padding: 10px;
  border-radius: 5px;

  &:focus {
    outline: none;
    background-color: #d7ccc8;
  }

  &::placeholder {
    color: #8d6e63;
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
  align-items: center;
  margin-left: 20px;
`;

const ShareOption = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
  cursor: pointer;
`;

const ShareButton = styled(Button)`
  background-color: #6d4c41;
  color: white;
  font-weight: 500;
  margin-right: 20px;
  &:disabled {
    background-color: #9e8f82;
    cursor: not-allowed;
  }
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

const genres = ["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Electronic", "Country", "R&B", "Folk", "Metal"];

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
  const [genre, setGenre] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

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
    if (!description.trim() && !audioFile && !pdfFile) {
      setErrorMessage('Please provide a description, audio file, or PDF file.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Description is required.');
      return;
    }

    if (!audioFile && !pdfFile) {
      setErrorMessage('At least one file (audio or PDF) is required.');
      return;
    }

    try {
      const newPost = {
        desc: description,
        audio: audioFile,
        pdf: pdfFile,
        username: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
        likes: 0,
        comments: 0,
        date: serverTimestamp(),
        genre: genre
      };

      const postId = await addPostToUser(currentUser.uid, newPost);

      setDescription('');
      setAudioFile(null);
      setAudioUrl(null);
      setPdfFile(null);
      setPdfUrl(null);
      setGenre('');
      setErrorMessage('');

      if (onPostAdded) {
        onPostAdded({
          id: postId,
          desc: description,
          audio: audioUrl,
          pdf: pdfUrl,
          username: currentUser.displayName,
          userPhotoURL: currentUser.photoURL,
          likes: 0,
          comments: 0,
          date: new Date().toLocaleString(),
          genre: genre
        });
      }

      console.log('Post shared successfully');
    } catch (error) {
      console.error('Error sharing post:', error);
      setErrorMessage('An error occurred while sharing the post. Please try again.');
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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (genre) => {
    setGenre(genre);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const menuId = 'genre-menu';

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
                  style={{ backgroundColor: '#6d4c41', color: 'white', marginRight: '10px' }}
                >
                  Upload Audio
                </Button>
              </label>
            </ShareOption>
            <ShareOption>
              <Button
                variant="contained"
                onClick={handleMenuClick}
                style={{ backgroundColor: '#6d4c41', color: 'white', marginRight: '10px' }}
              >
                {genre || 'Select Genre'}
              </Button>
              <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch',
                  },
                }}
              >
                {genres.map((g) => (
                  <MenuItem key={g} onClick={() => handleMenuClose(g)}>
                    {g}
                  </MenuItem>
                ))}
              </Menu>
            </ShareOption>
          </ShareOptions>
          <ShareButton onClick={handleShare} disabled={!description.trim() || (!audioFile && !pdfFile)}>
            Share
          </ShareButton>
        </ShareBottom>
        {errorMessage && (
          <Alert severity="error" style={{ marginTop: '10px' }}>
            {errorMessage}
          </Alert>
        )}
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
                src={pdfUrl} 
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
