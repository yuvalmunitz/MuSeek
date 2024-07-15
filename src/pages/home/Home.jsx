import React, { useState, useEffect } from 'react';
import Topbar from "../../components/topbar/Topbar";
import Feed from '../../components/HomeComponents/feed/Feed';
import Rightbar from "../../components/rightbar/Rightbar";
import styled from 'styled-components';
import { useAuth } from '../../firestore/AuthContext';

const HomeContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: #f5f5f5;
`;

function Home() {
  console.log('Home component rendering');
  const { currentUser } = useAuth();
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    console.log('Current user:', currentUser);
  }, [currentUser]);

  const openFavorites = () => {
    setShowFavorites(true);
  };

  const closeFavorites = () => {
    setShowFavorites(false);
  };

  if (!currentUser) {
    console.log('No current user');
    return <div>Loading...</div>;
  }

  return (
    <>
      <Topbar />
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