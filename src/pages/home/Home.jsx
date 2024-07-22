import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Topbar from "../../components/topbar/Topbar";
import Feed from '../../components/HomeComponents/feed/Feed';
import Favorites from '../../components/HomeComponents/favorites/Favorites';
import styled from 'styled-components';
import { useAuth } from '../../firestore/AuthContext';
import { addFavorite, removeFavorite, getUserFavorites } from '../../firestore/users';
import ScrollUpButton from '../../components/HomeComponents/scrollUp/ScrollUpButton'; // Correct the import path

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5; 
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow-y: auto;
  gap: 20px;
  padding: 20px;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const RightbarContainer = styled.div`
  flex: 3;
  padding: 20px;
  background-color: transparent;
`;

const FilterSection = styled.div`
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px 20px;
  background-color: ${props => props.selected ? '#6d4c41' : '#f1f1f1'};
  color: ${props => props.selected ? 'white' : 'black'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.selected ? '#6d4c41' : '#ddd'};
  }
`;

function Home() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [sortType, setSortType] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const allowedGenres = ["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Electronic", "Country", "R&B", "Folk", "Metal"];

  useEffect(() => {
    if (currentUser) {
      fetchUserFavorites();
    }
  }, [currentUser]);

  const fetchUserFavorites = async () => {
    try {
      const userFavorites = await getUserFavorites(currentUser.uid);
      console.log("Fetched user favorites:", userFavorites);
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
      console.log("Favorites updated:", favorites);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <>
      <Topbar />
      <HomeContainer>
        <ContentContainer>
          <MainContent>
            <Routes>
              <Route 
                path="/" 
                element={
                  <>
                    <Feed 
                      onFavoriteToggle={handleFavoriteToggle} 
                      favorites={favorites} 
                      sortType={sortType} 
                      selectedGenre={selectedGenre} 
                    />
                    <RightbarContainer>
                      <FilterSection>
                        <FilterTitle>Sort By</FilterTitle>
                        <Button onClick={() => setSortType('all')} selected={sortType === 'all'}>All Posts</Button>
                        <Button onClick={() => setSortType('lyrics')} selected={sortType === 'lyrics'}>Lyrics Posts</Button>
                        <Button onClick={() => setSortType('composition')} selected={sortType === 'composition'}>Composition Posts</Button>
                      </FilterSection>
                      <FilterSection>
                        <FilterTitle>Genres</FilterTitle>
                        <Button onClick={() => setSelectedGenre('all')} selected={selectedGenre === 'all'}>All Genres</Button>
                        {allowedGenres.map(genre => (
                          <Button key={genre} onClick={() => setSelectedGenre(genre)} selected={selectedGenre === genre}>{genre}</Button>
                        ))}
                      </FilterSection>
                    </RightbarContainer>
                  </>
                } 
              />
              <Route path="/favorites" element={<Favorites onFavoriteToggle={handleFavoriteToggle} />} />
            </Routes>
          </MainContent>
        </ContentContainer>
        <ScrollUpButton /> {/* Add the Scroll Up Button here */}
      </HomeContainer>
    </>
  );
}

export default Home;
