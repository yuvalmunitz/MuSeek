// Home.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate(); // Hook from react-router-dom

  const openFavorites = () => {
    setShowFavorites(true);
  };

  const closeFavorites = () => {
    setShowFavorites(false);
  };

  const handleLoginRedirect = () => {
    navigate('/Login'); // Redirect to Login page
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
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLoginRedirect}>Login</button>
      )}
      {userData && (
        <div>
          <p>Bio: {userData.bio}</p>
          <p>User ID: {userData.id}</p>
        </div>
      )}
    </>
  );
}

export default Home;
