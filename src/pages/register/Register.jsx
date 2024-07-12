import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { auth, provider, signInWithPopup } from '../../firebase-config'; // Update the path as needed
import GoogleIcon from '@mui/icons-material/Google'; // Import the Google icon
// import { createFirestoreUser } from '../../firestore/users';
const RegisterContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #e0dcd2; /* Light brown background */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RegisterWrapper = styled.div`
  width: 70%;
  height: 70%;
  display: flex;
`;

const RegisterLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RegisterRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
`;

const RegisterBox = styled.div`
  height: 450px; /* Increased height to accommodate Google button */
  padding: 20px;
  background-color: #f5f5f5; /* Light brownish background */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RegisterInput = styled.input`
  height: 50px;
  border-radius: 10px;
  border: 1px solid #8d6e63; /* Brown border */
  font-size: 18px;
  padding-left: 20px;

  &:focus {
    outline: none;
    border: 1px solid #5d4037; /* Dark brown border on focus */
  }
`;

const RegisterButton = styled.button`
  height: 50px;
  border-radius: 10px;
  border: none;
  background-color: #6d4c41; /* Medium brown background */
  color: white;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
`;

const GoogleButton = styled.button`
  height: 50px;
  border-radius: 10px;
  border: none;
  background-color: #6d4c41; /* Google red background */
  color: white;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export default function Register() {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        //createFirestoreUser(user)
        console.log(result.user);
        // Redirect to onboarding page
        navigate('/onboarding');
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here
      });
  };

  return (
    <RegisterContainer>
      <RegisterWrapper>
        <RegisterLeft>
          <RegisterLogo>MuSeek</RegisterLogo>
          <RegisterDesc>
            Connect with friends and the world around you on MuSeek.
          </RegisterDesc>
        </RegisterLeft>
        <RegisterRight>
          <RegisterBox>
            <RegisterInput placeholder="Username" />
            <RegisterInput placeholder="Email" />
            <RegisterInput placeholder="Password" />
            <RegisterInput placeholder="Password Again" />
            <RegisterButton>Sign Up</RegisterButton>
            <GoogleButton onClick={handleGoogleSignIn}>
              <GoogleIcon style={{ marginRight: '10px' }} />
              Sign in with Google
            </GoogleButton>
          </RegisterBox>
        </RegisterRight>
      </RegisterWrapper>
    </RegisterContainer>
  );
}
