import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, CircularProgress } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Post from '../post_l/Post_l';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background-color: #e0dcd2;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  background-color: #6d4c41;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled(IconButton)`
  color: white;
`;

const EmptyMessage = styled(Typography)`
  padding: 20px;
  text-align: center;
  color: #6d4c41;
`;

const FavoritesPopup = ({ open, onClose, favorites, onFavoriteToggle }) => {
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritePosts = async () => {
      if (favorites.length === 0) {
        setFavoritePosts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const posts = await Promise.all(
          favorites.map(async (postId) => {
            const postDoc = await getDoc(doc(db, "posts", postId));
            if (postDoc.exists()) {
              const postData = postDoc.data();
              return { 
                id: postDoc.id, 
                ...postData, 
                date: postData.date ? postData.date.toDate() : new Date(),
              };
            }
            return null;
          })
        );
        setFavoritePosts(posts.filter(post => post !== null));
      } catch (error) {
        console.error("Error fetching favorite posts:", error);
      }
      setLoading(false);
    };

    if (open) {
      fetchFavoritePosts();
    }
  }, [open, favorites]);

  const handleFavoriteToggle = (postId, isFavorite) => {
    onFavoriteToggle(postId, isFavorite);
    if (!isFavorite) {
      setFavoritePosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        Favorite Posts
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </StyledDialogTitle>
      <DialogContent>
        {loading ? (
          <EmptyMessage variant="body1">
          You haven't added any posts to your favorites yet.
        </EmptyMessage>
        ) : favoritePosts.length === 0 ? (
          <EmptyMessage variant="body1">
            You haven't added any posts to your favorites yet.
          </EmptyMessage>
        ) : (
          favoritePosts.map((post) => (
            <Post 
              key={post.id} 
              post={post} 
              onFavoriteToggle={handleFavoriteToggle} 
              isFavorite={true}
            />
          ))
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default FavoritesPopup;