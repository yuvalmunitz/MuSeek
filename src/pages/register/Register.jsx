import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth, provider, signInWithPopup } from '../../firebase-config'; // Update the path as needed
import GoogleIcon from '@mui/icons-material/Google'; // Import the Google icon
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../firebase-config'; // Import your Firestore instance

const RegisterContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #e0dcd2; /* Light brown background */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
`;

const RegisterWrapper = styled.div`
  width: 70%;
  height: 70%;
  display: flex;
  align-items: center;
`;

const RegisterLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 10px 0 0 10px; /* Rounded corners on the left */
`;

const MusicImage = styled.img`
  width: 80%;
  height: 80%;
  object-fit: cover;
  border-radius: 10px 0 0 10px; /* Rounded corners */
`;

const RegisterRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const RegisterLogo = styled.h3`
  font-size: 50px;
  font-weight: 800;
  color: #5d4037; /* Dark brown color */
  margin-bottom: 10px;
`;

const RegisterDesc = styled.span`
  font-size: 24px;
  color: #3e2723; /* Deep brown color */
  margin-bottom: 20px;
`;

const GoogleButton = styled.button`
  height: 50px;
  border-radius: 10px;
  border: none;
  background-color: #6d4c41; /* Medium brown background */
  color: white;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  margin-top: 20px;
`;

export default function Register() {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google Sign-In Result:', user);

      // Check if user is already registered in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // User is not registered, register them and redirect to /OnBoarding
        await setDoc(userDocRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        navigate('/OnBoarding');
      } else {
        // User is already registered, redirect to /home
        navigate('/home');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <RegisterContainer>
      <RegisterWrapper>
        <RegisterLeft>
          <MusicImage src='/assets/onboard.png' alt='Music' /> {/* Path to your music-themed image */}
        </RegisterLeft>
        <RegisterRight>
          <RegisterLogo>MuSeek</RegisterLogo>
          <RegisterDesc>
            Connect with friends and the world around you on MuSeek.
          </RegisterDesc>
          <GoogleButton onClick={handleGoogleSignIn}>
            <GoogleIcon style={{ marginRight: '10px' }} />
            Sign in with Google
          </GoogleButton>
        </RegisterRight>
      </RegisterWrapper>
    </RegisterContainer>
  );
}
