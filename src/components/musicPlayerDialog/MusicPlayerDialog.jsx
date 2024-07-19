import React, { useState, useRef } from 'react';
import { Typography, Slider, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { PlayArrow, Pause, Close } from '@mui/icons-material';
import { styled } from '@mui/system';
// import StyledButton from './StyledButton';  // Import the StyledButton component
import { Button } from '@mui/material';

const StyledButton = styled(Button)({
  backgroundColor: '#6d4c41',
  color: 'white',
  '&:hover': {
    backgroundColor: '#5d4037',
  },
});

const StyledSlider = styled(Slider)({
  color: '#6d4c41',
  '& .MuiSlider-thumb': {
    backgroundColor: '#6d4c41',
  },
  '& .MuiSlider-track': {
    backgroundColor: '#6d4c41',
  },
  '& .MuiSlider-rail': {
    backgroundColor: '#6d4c41',
  },
});

const StyledTypography = styled(Typography)({
  color: '#3e2723',
});

const MusicPlayerDialog = ({ audioFile, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
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

  const handleSliderChange = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Dialog open={Boolean(audioFile)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Music Player</DialogTitle>
      <DialogContent>
        {audioFile && (
          <Box sx={{ mt: 2 }}>
            <audio
              ref={audioRef}
              src={audioFile}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
            <StyledButton onClick={togglePlayPause} variant="contained" sx={{ mb: 2 }}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </StyledButton>
            <StyledSlider
              value={currentTime}
              max={duration}
              onChange={handleSliderChange}
              aria-labelledby="continuous-slider"
            />
            <StyledTypography variant="body2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </StyledTypography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} startIcon={<Close />}>
          Close
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default MusicPlayerDialog;