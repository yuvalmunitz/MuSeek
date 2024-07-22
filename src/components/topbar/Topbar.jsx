import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Chat } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../firestore/AuthContext';

const TopbarContainer = styled.div`
  height: 50px;
  width: 100%;
  background-color: #6d4c41;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 999;
  padding: 80 120;
`;

const TopbarLeft = styled.div`
  flex: 3;
`;

const Logo = styled.span`
  font-size: 24px;
  margin-left: 20px;
  font-weight: bold;
  color: white;
  cursor: pointer;
`;

const TopbarCenter = styled.div`
  flex: 5;
  display: flex;
  align-items: center;
`;

const Searchbar = styled.div`
  width: 100%;
  height: 30px;
  background-color: white;
  border-radius: 30px;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  font-size: 20px !important;
  margin-left: 10px;
`;

const SearchInput = styled.input`
  border: none;
  width: 80%;
  &:focus {
    outline: none;
  }
`;

const TopbarRight = styled.div`
  flex: 4;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: white;
`;

const TopbarIcons = styled.div`
  display: flex;
  align-items: center;
`;

const TopbarIconItem = styled.div`
  margin-right: 10px;
  cursor: pointer;
  position: relative;
`;

const StyledButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const UserName = styled.span`
  margin-right: 10px;
  font-size: 14px;
`;

const TopbarImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  margin-left: 5px;
`;

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [imgError, setImgError] = useState(false);

  const handleNavigation = () => {
    if (location.pathname === '/Home') {
      navigate('/Profile');
    } else {
      navigate('/Home');
    }
  };

  const handleChatClick = () => {
    navigate('/Inbox');
  };

  const handleImageError = () => {
    setImgError(true);
  };

  const handleLogoClick = () => {
    navigate('/Home');
  };

  return (
    <TopbarContainer>
      <TopbarLeft>
        <Logo onClick={handleLogoClick}>MuSeek</Logo>
      </TopbarLeft>
      <TopbarCenter>
        {/* <Searchbar>
          <SearchIcon />
          <SearchInput placeholder="Search for a user or a keyword" />
        </Searchbar> */}
      </TopbarCenter>
      <TopbarRight>
        <StyledButton onClick={handleNavigation}>
          {location.pathname === '/Home' ? '' : 'Home'}
        </StyledButton>
        <TopbarIcons>
          <TopbarIconItem onClick={handleChatClick}>
            <Chat />
          </TopbarIconItem>
        </TopbarIcons>
        {currentUser && (
          <TopbarImg 
            src={imgError ? 'https://example.com/default-avatar.png' : currentUser.photoURL} 
            alt={currentUser.displayName}
            onError={handleImageError}
          />
        )}
      </TopbarRight>
    </TopbarContainer>
  );
}
