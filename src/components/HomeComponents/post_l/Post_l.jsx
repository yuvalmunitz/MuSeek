
// Updated Post_l.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Star, StarBorder, ChatBubbleOutline, PlayArrow, Pause, PictureAsPdf } from '@mui/icons-material';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slider } from '@mui/material';
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

// const PostProfileImg = styled.img`
//   width: 32px;
//   height: 32px;
//   border-radius: 50%;
//   object-fit: cover;
// `;

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
const PostProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const AudioPlayer = styled.audio`
  display: none;
`;

function Post({ post, toggleFavorite }) {
  const { currentUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reactionDialogOpen, setReactionDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    console.log("Post audio URL:", post.audio);
    console.log("Post PDF URL:", post.pdf);

    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [post]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
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

  const handleSliderChange = (_, newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleImageError = () => {
    setImgError(true);
  };

  const isCurrentUserPost = post.userId === currentUser?.uid;

  return (
    <PostContainer>
      <PostWrapper>
        <PostTop>
          <PostTopLeft>
            <PostProfileImg
              src={imgError ? 'https://example.com/default-avatar.png' : 
                   (isCurrentUserPost ? currentUser.photoURL : post.userPhotoURL)}
              alt={isCurrentUserPost ? currentUser.displayName : post.username}
              onError={handleImageError}
            />
            <PostUsername>{isCurrentUserPost ? currentUser.displayName : post.username}</PostUsername>
            <PostDate>{post.date}</PostDate>
          </PostTopLeft>
          <PostTopRight>
            <IconButton onClick={() => toggleFavorite(post.id)}>
              {post.isFavorite ? <Star htmlColor="#6d4c41" /> : <StarBorder htmlColor="#6d4c41" />}
            </IconButton>
            <IconButton onClick={() => setReactionDialogOpen(true)}>
              <ChatBubbleOutline htmlColor="#6d4c41" />
            </IconButton>
          </PostTopRight>
        </PostTop>
        <PostCenter>
        <PostText>{post.desc}</PostText>
        {post.pdf && (
          <Button onClick={() => setPdfDialogOpen(true)} startIcon={<PictureAsPdf />}>
            View PDF
          </Button>
        )}
        {post.audio && (
          <AudioPlayerContainer>
            <audio ref={audioRef} src={post.audio} />
            <IconButton onClick={handlePlayPause}>
              {isPlaying ? <Pause htmlColor="#6d4c41" /> : <PlayArrow htmlColor="#6d4c41" />}
            </IconButton>
            <Slider
              value={currentTime}
              max={duration}
              onChange={handleSliderChange}
              aria-labelledby="continuous-slider"
            />
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </AudioPlayerContainer>
        )}
      </PostCenter>
      </PostWrapper>
      <AlertDialogSlide open={dialogOpen} handleClose={() => setDialogOpen(false)} />
      <ReactionDialog
        open={reactionDialogOpen}
        onClose={() => setReactionDialogOpen(false)}
        onSend={(reaction) => console.log('Reaction sent:', reaction)}
      />
      <Dialog
        open={pdfDialogOpen}
        onClose={() => setPdfDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>PDF Viewer</DialogTitle>
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
          <Button onClick={() => setPdfDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </PostContainer>
  );
}

export default Post;

