import React from 'react';
import styled from 'styled-components';
import { Search, Chat } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const TopbarContainer = styled.div`
  height: 50px;
  width: 100%;
  background-color: #6d4c41; /* Medium brown background */
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 999;
  padding: 80 120; /* Added padding to adjust overall left and right margins */
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

// const TopbarLink = styled.span`
//   margin-right: 10px; /* Decreased margin-right to move elements to the left */
//   font-size: 14px;
//   cursor: pointer;
// `;

const TopbarIcons = styled.div`
  display: flex;
  align-items: center;
`;

const TopbarIconItem = styled.div`
  margin-right: 10px; /* Decreased margin-right to move elements to the left */
  cursor: pointer;
  position: relative;
`;

// const TopbarIconBadge = styled.span`
//   width: 15px;
//   height: 15px;
//   background-color: red;
//   border-radius: 50%;
//   color: white;
//   position: absolute;
//   top: -5px;
//   right: -5px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 12px;
// `;

const StyledButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 6px 12px;
  margin-right: 10px;
`;

const TopbarImg = styled.img`
width: 32px;
height: 32px;
border-radius: 50%;
object-fit: cover;
cursor: pointer;
margin-left: 5px; /* Decreased margin-left to move elements to the left */
`;
export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <TopbarContainer>
      <TopbarLeft>
        <Logo>MuSeek</Logo>
      </TopbarLeft>
      <TopbarCenter>
        <Searchbar>
          <SearchIcon />
          <SearchInput placeholder="Search for a user or a keyword" />
        </Searchbar>
      </TopbarCenter>
      <TopbarRight>
        <StyledButton onClick={handleNavigation}>
        {/*'' empty path to dont show profile */}
          {location.pathname === '/Home' ? '' : 'Home'}
        </StyledButton>
        <TopbarIcons>
          <TopbarIconItem onClick={handleChatClick}>
            <Chat />
            {/* <TopbarIconBadge>1</TopbarIconBadge> */}
          </TopbarIconItem>
        </TopbarIcons>
        <TopbarImg src="/assets/person/1.jpeg" alt="" />
      </TopbarRight>
    </TopbarContainer>
  );
}