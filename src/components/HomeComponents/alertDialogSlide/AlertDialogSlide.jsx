import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Styled components for the brownish theme
const StyledDialog = styled(Dialog)`
  & .MuiPaper-root {
    background-color: #8b4513; /* Light brownish background */
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  background-color: #6d4c41; /* SaddleBrown background */
  color: white;
`;

const StyledDialogContent = styled(DialogContent)`
  background-color: #f5f5f5; /* Light brownish background */
  color: #3e2723; /* Dark brown text */
`;

const StyledDialogContentText = styled(DialogContentText)`
  color: #3e2723; /* Dark brown text */
`;

const StyledDialogActions = styled(DialogActions)`
  background-color: #f5f5f5; /* Light brownish background */
`;

const StyledButton = styled(Button)`
  background-color: #6d4c41; /* Medium brown background */
  color: white;

  &:hover {
    background-color: #5d4037; /* Darker brown background on hover */
  }
`;

export default function AlertDialogSlide({ open, handleClose }) {
  return (
    <StyledDialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <StyledDialogTitle>{"Copyrights Terms"}</StyledDialogTitle>
      <StyledDialogContent>
        <StyledDialogContentText id="alert-dialog-slide-description">
          By accessing this pre-released material, you acknowledge that it is confidential and protected by copyright law. You agree not to share, distribute, or reproduce any part of this material without prior written consent from the publisher. Unauthorized use or disclosure of this material is strictly prohibited and may result in legal action.
        </StyledDialogContentText>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton onClick={handleClose}>Disagree</StyledButton>
        <StyledButton onClick={handleClose}>Agree</StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}