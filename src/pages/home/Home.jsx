import React, { useState } from 'react';
import Topbar from "../../components/topbar/Topbar";
import Feed from '../../components/HomeComponents/feed/Feed';
import Rightbar from "../../components/rightbar/Rightbar";
import styled from 'styled-components';
// TODO : customise the page for the user
// import { getUserData } from '../../firestore/users';
// import { auth } from '../../firebase-config';

const HomeContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: #f5f5f5;
`;

function Home() {
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
