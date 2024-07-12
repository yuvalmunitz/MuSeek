import React, { useState } from 'react';
import { Button, Container, Box, Typography, Paper, FormControlLabel, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/system';
import questions from './Questions';
import { useNavigate } from 'react-router-dom';

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#e0dcd2',
  color: '#3e2723',
  minHeight: '100vh',
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  color: '#3e2723',
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#6d4c41',
  color: 'white',
  '&:hover': {
    backgroundColor: '#5d4037',
  },
  marginRight: theme.spacing(2),
}));

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: '#8d6e63',
  '&.Mui-checked': {
    color: '#5d4037',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#f5f5f5',
    color: '#3e2723',
  },
}));

const OutlinedStyledButton = styled(Button)(({ theme }) => ({
  color: '#6d4c41',
  borderColor: '#6d4c41',
  '&:hover': {
    backgroundColor: 'rgba(109, 76, 65, 0.04)',
    borderColor: '#5d4037',
  },
  margin: theme.spacing(1),
}));

const OnBoarding = () => {
  const [answers, setAnswers] = useState({});
  const [openCopyrightDialog, setOpenCopyrightDialog] = useState(false);
  const navigate = useNavigate();

  const handleToggle = (questionIndex, option) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      if (!newAnswers[questionIndex]) newAnswers[questionIndex] = [];
      if (newAnswers[questionIndex].includes(option)) {
        newAnswers[questionIndex] = newAnswers[questionIndex].filter(
          (answer) => answer !== option
        );
      } else {
        newAnswers[questionIndex].push(option);
      }
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    console.log('Final Answers:', answers);
    setOpenCopyrightDialog(true);
  };

  const handleSkip = () => {
    navigate('/Home');
  };

  const handleAgree = () => {
    setOpenCopyrightDialog(false);
    navigate('/Home');
  };

  const handleDisagree = () => {
    setOpenCopyrightDialog(false);
    // Optionally, you can show a message or take other actions if the user disagrees
  };

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Music Taste Questionnaire
      </Typography>
      <Typography variant="body1" paragraph>
        Please answer the following questions to help us personalize your experience.
      </Typography>
      {questions.map((q, index) => (
        <StyledPaper key={index} elevation={3}>
          <Typography variant="h6" gutterBottom>
            {q.question}
          </Typography>
          {q.options.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <StyledCheckbox
                  checked={answers[index]?.includes(option) || false}
                  onChange={() => handleToggle(index, option)}
                />
              }
              label={option}
            />
          ))}
        </StyledPaper>
      ))}
      <Box mt={3}>
        <StyledButton onClick={handleSubmit} variant="contained">
          Submit
        </StyledButton>
        <StyledButton onClick={handleSkip} variant="outlined">
          Skip
        </StyledButton>
      </Box>
      <Typography variant="body2" mt={2} color="textSecondary">
        Disclaimer: By pressing Submit or Skip, you can proceed to the main application. Your answers will be saved if you choose to submit.
      </Typography>

      <StyledDialog open={openCopyrightDialog} onClose={handleDisagree}>
        <DialogTitle>Copyright Agreement</DialogTitle>
        <DialogContent>
          <Typography>
            By clicking "Agree", you acknowledge and agree that all lyrics and compositions you encounter on this website are protected under copyright laws. You agree to respect these copyrights and not to use, reproduce, or distribute this content without proper authorization.
          </Typography>
        </DialogContent>
        <DialogActions>
          <OutlinedStyledButton onClick={handleDisagree} variant="outlined">
            Disagree
          </OutlinedStyledButton>
          <StyledButton onClick={handleAgree} variant="contained">
            Agree
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </StyledContainer>
  );
};

export default OnBoarding;