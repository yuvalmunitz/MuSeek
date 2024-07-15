import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Star, StarBorder, ChatBubbleOutline, PlayArrow, Pause, PictureAsPdf } from '@mui/icons-material';
import { Users } from '../../../dummyData';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slider } from '@mui/material';
// import ReadMoreIcon from '@mui/icons-material/ReadMore';
import AlertDialogSlide from '../alertDialogSlide/AlertDialogSlide';
import ReactionDialog from '../reactionDialog/ReactionDialog';
import { useAuth } from '../../../firestore/AuthContext';

// Define styled components
const PostContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  margin: 30px 0;
  background-color: #e0dcd2; 
`;

const PostWrapper = styled.div`
  padding: 10px;
`;

const PostTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PostTopLeft = styled.div`
  display: flex;
  align-items: center;
`;

const PostProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const PostUsername = styled.span`
  font-size: 15px;
  font-weight: 500;
  margin: 0 10px;
  color: #3e2723; /* Dark brown text */
`;

const PostDate = styled.span`
  font-size: 12px;
  color: #6d4c41; /* Medium brown text */
`;

const PostTopRight = styled.div`
  display: flex;
  align-items: center;
`;

const PostCenter = styled.div`
  margin: 20px 0;
`;

const PostText = styled.span`
  display: block;
  margin-bottom: 10px;
  color: #000; /* Black text */
`;

const ReadMoreContainer = styled.div`
  display: flex;
  align-items: center;
  color: #6d4c41; 
  cursor: pointer;
`;

const AudioPlayerContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
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

const FileButton = styled(Button)`
  background-color: #6d4c41;
  color: white;
  margin-right: 10px;
  &:hover {
    background-color: #5d4037;
  }
`;

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

// export default 
function Post({ post, toggleFavorite }) {
  const { currentUser } = useAuth();  // Add this line
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reactionDialogOpen, setReactionDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const audioRef = useRef(null);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleReactionDialogOpen = () => {
    setReactionDialogOpen(true);
  };

  const handleReactionDialogClose = () => {
    setReactionDialogOpen(false);
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(post.id);
  };

  const handleSendReaction = (reaction) => {
    console.log('Reaction sent:', reaction);
  };

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

  const handlePdfOpen = () => {
    setPdfDialogOpen(true);
  };

  const handlePdfClose = () => {
    setPdfDialogOpen(false);
  };

  return (
    <PostContainer>
      <PostWrapper>
        <PostTop>
          <PostTopLeft>
            <PostProfileImg
              src={post.userId === currentUser.uid ? currentUser.photoURL : post.userPhotoURL}
              alt=""
            />
            <PostUsername>
              {post.userId === currentUser.uid ? currentUser.displayName : post.username}
            </PostUsername>
            <PostDate>{post.date}</PostDate>
          </PostTopLeft>
          <PostTopRight>
            <IconButton onClick={handleFavoriteToggle}>
              {post.isFavorite ? <Star htmlColor="#6d4c41" /> : <StarBorder htmlColor="#6d4c41" />}
            </IconButton>
            <IconButton onClick={handleReactionDialogOpen}>
              <ChatBubbleOutline htmlColor="#6d4c41" />
            </IconButton>
          </PostTopRight>
        </PostTop>
        <PostCenter>
          <PostText>{post?.desc}</PostText>
          {post.pdf && (
            <FileButton onClick={handlePdfOpen} startIcon={<PictureAsPdf />} sx={{ color: '#6d4c41' }}>
              View Lyrics (PDF)
            </FileButton>
          )}
          {post.audio && (
            <AudioPlayerContainer>
              <audio
                ref={audioRef}
                src={post.audio}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              />
              <IconButton onClick={togglePlayPause}>
                {isPlaying ? <Pause htmlColor="#6d4c41" /> : <PlayArrow htmlColor="#6d4c41" />}
              </IconButton>
              <StyledSlider
                value={currentTime}
                max={duration}
                onChange={handleSliderChange}
                aria-labelledby="continuous-slider"
                sx={{ width: '60%', mx: 2 }}
              />
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </AudioPlayerContainer>
          )}
        </PostCenter>
      </PostWrapper>
      <AlertDialogSlide open={dialogOpen} handleClose={handleDialogClose} />
      <ReactionDialog
        open={reactionDialogOpen}
        onClose={handleReactionDialogClose}
        onSend={handleSendReaction}
      />
      <StyledDialog
        open={pdfDialogOpen}
        onClose={handlePdfClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="pdf-dialog-title"
      >
        <DialogTitle id="pdf-dialog-title">PDF Viewer</DialogTitle>
        <DialogContent>
          {post.pdf && (
            <iframe 
              src={post.pdf} 
              width="100%" 
              height="600px" 
              style={{ border: 'none' }}
              title="PDF Viewer"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePdfClose} style={{ backgroundColor: '#6d4c41', color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
    </PostContainer>
  );
}

// At the end of Post_l.jsx
export default Post;