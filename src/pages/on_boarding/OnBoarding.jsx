import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import {
  getOrCreateUser,
  updateUserGenres,
  updateUserType,
  updateUserPerformer,
  updateUserRecorder,
  updateUserExperience
} from '../../firestore/users';
import questions from './Questions';

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

const StyledRadio = styled(Radio)(({ theme }) => ({
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
  const [answers, setAnswers] = useState({
    genres: [],
    userType: "",
    performer: "",
    recorder: "",
    experience: ""
  });
  const [missingAnswers, setMissingAnswers] = useState(false);
  const [openCopyrightDialog, setOpenCopyrightDialog] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async (authUser) => {
      try {
        const userDetails = await getOrCreateUser(authUser.uid);
        setUser(userDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching or creating user:", error);
        setError("Failed to fetch or create user. Please try again.");
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        fetchUser(authUser);
      } else {
        console.log("No authenticated user found");
        navigate('/register');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleToggle = (field, option) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      const question = questions.find(q => q.field === field);
      if (question.isMultipleChoice) {
        if (!newAnswers[field]) newAnswers[field] = [];
        if (newAnswers[field].includes(option)) {
          newAnswers[field] = newAnswers[field].filter(
              (answer) => answer !== option
          );
        } else {
          newAnswers[field] = [...newAnswers[field], option];
        }
      } else {
        newAnswers[field] = option;
      }
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    const requiredFields = ['genres', 'userType', 'performer', 'recorder', 'experience'];
    const hasMissingAnswers = requiredFields.some(field => !answers[field] || answers[field].length === 0);

    if (hasMissingAnswers) {
      setMissingAnswers(true);
      return;
    }

    if (user) {
      try {
        await updateUserGenres(user.id, answers.genres);
        await updateUserType(user.id, answers.userType);
        await updateUserPerformer(user.id, answers.performer);
        await updateUserRecorder(user.id, answers.recorder);
        await updateUserExperience(user.id, answers.experience);

        console.log('Onboarding answers saved:', answers);
        setOpenCopyrightDialog(true);
      } catch (error) {
        console.error('Error saving onboarding answers:', error);
        setError('Failed to save answers. Please try again.');
      }
    } else {
      setError('No user found. Please try logging in again.');
    }
  };

  const handleCloseMissingAnswers = () => {
    setMissingAnswers(false);
  };

  const handleAgree = () => {
    setOpenCopyrightDialog(false);
    navigate('/Home');
  };

  const handleDisagree = () => {
    setOpenCopyrightDialog(false);
  };

  if (loading) {
    return (
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
            <Typography variant="h6" style={{ marginLeft: 20 }}>Loading user data...</Typography>
          </Box>
        </Container>
    );
  }

  if (error) {
    return (
        <Container>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
            <Typography color="error" gutterBottom>{error}</Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Box>
        </Container>
    );
  }

  if (!user) {
    return (
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Typography>No user found. Please <Button onClick={() => navigate('/register')}>register</Button> or <Button onClick={() => navigate('/login')}>login</Button>.</Typography>
          </Box>
        </Container>
    );
  }

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
              {q.isMultipleChoice ? (
                  <Box>
                    {q.options.map((option) => (
                        <FormControlLabel
                            key={option}
                            control={
                              <StyledCheckbox
                                  checked={answers[q.field]?.includes(option) || false}
                                  onChange={() => handleToggle(q.field, option)}
                              />
                            }
                            label={option}
                        />
                    ))}
                  </Box>
              ) : (
                  <RadioGroup
                      value={answers[q.field] || ''}
                      onChange={(e) => handleToggle(q.field, e.target.value)}
                  >
                    {q.options.map((option) => (
                        <FormControlLabel
                            key={option}
                            value={option}
                            control={<StyledRadio />}
                            label={option}
                        />
                    ))}
                  </RadioGroup>
              )}
            </StyledPaper>
        ))}
        <Box mt={3}>
          <StyledButton onClick={handleSubmit} variant="contained">
            Submit
          </StyledButton>
        </Box>
        <Typography variant="body2" mt={2} color="textSecondary">
          Disclaimer: By pressing Submit or Skip, you can proceed to the main application. Your answers will be saved if you choose to submit.
        </Typography>

        <StyledDialog open={missingAnswers} onClose={handleCloseMissingAnswers}>
          <DialogTitle>Missing Answers</DialogTitle>
          <DialogContent>
            <Typography>
              Please answer all the questions before submitting the form.
            </Typography>
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={handleCloseMissingAnswers} variant="contained">
              OK
            </StyledButton>
          </DialogActions>
        </StyledDialog>

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