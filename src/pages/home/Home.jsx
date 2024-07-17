import React, { useState, useEffect } from 'react';
import Topbar from "../../components/topbar/Topbar";
import Feed from '../../components/HomeComponents/feed/Feed';
import Rightbar from "../../components/rightbar/Rightbar";
import styled from 'styled-components';
import { useAuth } from '../../firestore/AuthContext';
import { addFavorite, removeFavorite, getUserFavorites } from '../../firestore/users';
import FavoritesPopup from '../../components/HomeComponents/favoritesPopup/FavoritesPopup';

const HomeContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: #f5f5f5;
`;

function Home() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserFavorites();
    }
  }, [currentUser]);

  const fetchUserFavorites = async () => {
    try {
      const userFavorites = await getUserFavorites(currentUser.uid);
      setFavorites(userFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handleFavoriteToggle = async (postId, isFavorite) => {
    try {
      if (isFavorite) {
        await addFavorite(currentUser.uid, postId);
        setFavorites(prev => [...prev, postId]);
      } else {
        await removeFavorite(currentUser.uid, postId);
        setFavorites(prev => prev.filter(id => id !== postId));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <>
      <Topbar />
      <HomeContainer>
        <Feed onFavoriteToggle={handleFavoriteToggle} favorites={favorites} />
        <Rightbar openFavorites={() => setShowFavorites(true)} />
      </HomeContainer>
      <FavoritesPopup 
        open={showFavorites}
        onClose={() => setShowFavorites(false)}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </>
  );
}

export default Home;


