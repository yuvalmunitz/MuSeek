import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Star, StarBorder, ChatBubbleOutline, PlayArrow, Pause, PictureAsPdf } from '@mui/icons-material';
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Slider, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';
import AlertDialogSlide from '../alertDialogSlide/AlertDialogSlide';
import ReactionDialog from '../reactionDialog/ReactionDialog';
import { useAuth } from '../../../firestore/AuthContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import ScrollUpButton from '../scrollUp/ScrollUpButton';

const PostContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 0 16px -8px rgba(0, 0, 0, 0.68);
  margin: 30px 0;
  background-color: #e0dcd2;
  overflow-y: auto; /* Add scrolling */
  max-height: 500px; /* Set a max height */
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

const PostUsername = styled.span`
  font-size: 15px;
  font-weight: 500;
  margin: 0 10px;
  color: #3e2723;
`;

const PostDate = styled.span`
  font-size: 12px;
  color: #6d4c41;
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
  color: #000;
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

const PostProfileImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const CommentSection = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 10px;
`;

const CommentButton = styled(Button)`
  background-color: #6d4c41;
  color: white;
  margin-bottom: 10px;
  &:hover {
    background-color: #5d4037;
  }
`;

function Post({ post, onFavoriteToggle, isFavorite }) {
  const { currentUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reactionDialogOpen, setReactionDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const audioRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (showComments) {
      const commentsRef = collection(db, "posts", post.id, "comments");
      const q = query(commentsRef, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const commentList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentList);
      });

      return () => unsubscribe();
    }
  }, [post.id, showComments]);

  const handleFavoriteToggle = () => {
    onFavoriteToggle(post.id, !isFavorite);
  };

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

  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (typeof date === 'string') {
      return new Date(date).toLocaleString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Unknown date';
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  return (
      <PostContainer>
        <PostWrapper>
          <PostTop>
            <PostTopLeft>
              <PostProfileImg
                  src={post.userPhotoURL || 'https://example.com/default-avatar.png'}
                  alt={post.username}
                  onError={handleImageError}
              />
              <PostUsername>{post.username}</PostUsername>
              <PostDate>{formatDate(post.date)}</PostDate>
            </PostTopLeft>
            <PostTopRight>
              <IconButton onClick={handleFavoriteToggle}>
                {isFavorite ? <Star htmlColor="#6d4c41" /> : <StarBorder htmlColor="#6d4c41" />}
              </IconButton>
              <IconButton onClick={handleToggleComments}>
                <ChatBubbleOutline htmlColor="#6d4c41" />
              </IconButton>
            </PostTopRight>
          </PostTop>
          <PostCenter>
            <PostText>{post.desc}</PostText>
            {post.pdf && (
                <Button  onClick={() => setPdfDialogOpen(true)} startIcon={<PictureAsPdf htmlColor="#6d4c41" />} sx={{color: '#6d4c41'}}>
                  View PDF
                </Button>
            )}
            {post.audio && (
                <AudioPlayerContainer>
                  <audio ref={audioRef} src={post.audio} />
                  <IconButton onClick={handlePlayPause}>
                    {isPlaying ? <Pause htmlColor="#6d4c41" /> : <PlayArrow htmlColor="#6d4c41" />}
                  </IconButton>
                  <StyledSlider
                      value={currentTime}
                      max={duration}
                      onChange={handleSliderChange}
                      aria-labelledby="continuous-slider"
                  />
                  <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                </AudioPlayerContainer>
            )}
          </PostCenter>
          {showComments && (
              <CommentSection>
                <CommentButton sx={{color: '#6d4c41'}} onClick={() => setReactionDialogOpen(true)}>
                  Add Comment
                </CommentButton>
                <List>
                  {comments.map((comment) => (
                      <ListItem key={comment.id}>
                        <ListItemAvatar>
                          <Avatar src={comment.userPhotoURL} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={comment.title}
                            secondary={
                              <>
                                <Typography component="span" variant="body2" color="textPrimary">
                                  {comment.username}
                                </Typography>
                              </>
                            }
                        />
                      </ListItem>
                  ))}
                </List>
              </CommentSection>
          )}
        </PostWrapper>
        <AlertDialogSlide open={dialogOpen} handleClose={() => setDialogOpen(false)} />
        <ReactionDialog
            open={reactionDialogOpen}
            onClose={() => setReactionDialogOpen(false)}
            postId={post.id}
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
            <Button onClick={() => setPdfDialogOpen(false)} sx={{color: '#6d4c41'}}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <ScrollUpButton /> {/* Add ScrollUpButton */}
      </PostContainer>
  );
}

export default Post;