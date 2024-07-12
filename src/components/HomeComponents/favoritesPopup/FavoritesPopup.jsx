import React from 'react';
import styled from 'styled-components';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import Post from '../post_l/Post_l';

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

const FavoritesPopup = ({ open, onClose, favoritePosts }) => {
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        Favorite Posts
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </StyledDialogTitle>
      <DialogContent>
        {favoritePosts.length > 0 ? (
          favoritePosts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <EmptyMessage variant="body1">
            You haven't added any posts to your favorites yet.
          </EmptyMessage>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default FavoritesPopup;