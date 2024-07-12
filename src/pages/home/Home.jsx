// Home.jsx
import React, { useState, useContext } from 'react';
import Topbar from "../../components/topbar/Topbar";
import Feed from '../../components/HomeComponents/feed/Feed';
import Rightbar from "../../components/rightbar/Rightbar";
import styled from 'styled-components';
import { AuthContext } from '../../firestore/AuthContext'; // Adjust the path as needed

const HomeContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: #f5f5f5;
`;

function Home() {
  const { user, userData, logout } = useContext(AuthContext);
  const [showFavorites, setShowFavorites] = useState(false);

  const openFavorites = () => {
    setShowFavorites(true);
  };

  const closeFavorites = () => {
    setShowFavorites(false);
  };

  return (
    <>
      <Topbar />
      <UserInfo>
        {currentUser && (
          <>
            <UserImage src={currentUser.photoURL} alt={`${currentUser.displayName}'s profile`} />
            <span>{currentUser.displayName}</span>
          </>
        )}
      </UserInfo>
      <HomeContainer>
        <Feed 
          showFavorites={showFavorites} 
          setShowFavorites={setShowFavorites} 
          closeFavorites={closeFavorites}
        />
        <Rightbar openFavorites={openFavorites} />
      </HomeContainer>
    </>
  );
}

export default Home;
