import React from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #e0dcd2; /* Light brown background */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginWrapper = styled.div`
  width: 70%;
  height: 70%;
  display: flex;
`;

const LoginLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoginRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoginLogo = styled.h3`
  font-size: 50px;
  font-weight: 800;
  color: #5d4037; /* Dark brown color */
  margin-bottom: 10px;
`;

const LoginDesc = styled.span`
  font-size: 24px;
  color: #3e2723; /* Deep brown color */
`;

const LoginBox = styled.div`
  height: 300px;
  padding: 20px;
  background-color: #f5f5f5; /* Light brownish background */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const LoginInput = styled.input`
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

const LoginButton = styled.button`
  height: 50px;
  border-radius: 10px;
  border: none;
  background-color: #6d4c41; /* Medium brown background */
  color: white;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
`;

const LoginForgot = styled.span`
  text-align: center;
  color: #5d4037; /* Dark brown color */
`;

const LoginRegisterButton = styled.button`
  width: 60%;
  align-self: center;
  height: 50px;
  border-radius: 10px;
  border: none;
  background-color: #8d6e63; /* Brown background */
  color: white;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
`;

export default function Login() {
  return (
    <LoginContainer>
      <LoginWrapper>
        <LoginLeft>
          <LoginLogo>MuSeek</LoginLogo>
          <LoginDesc>
            Connect with lyricists and Composers around you on MuSeek.
          </LoginDesc>
        </LoginLeft>
        <LoginRight>
          <LoginBox>
            <LoginInput placeholder="Email" />
            <LoginInput placeholder="Password" />
            <LoginButton>Log In</LoginButton>
            <LoginForgot>Forgot Password?</LoginForgot>
            <LoginRegisterButton>
              Create a New Account
            </LoginRegisterButton>
          </LoginBox>
        </LoginRight>
      </LoginWrapper>
    </LoginContainer>
  );
}