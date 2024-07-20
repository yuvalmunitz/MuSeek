import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Topbar from "../../components/topbar/Topbar";
import Feed from '../../components/HomeComponents/feed/Feed';
import Favorites from '../../components/HomeComponents/favorites/Favorites';
import Rightbar from "../../components/rightbar/Rightbar";
import styled from 'styled-components';
import { useAuth } from '../../firestore/AuthContext';
import { addFavorite, removeFavorite, getUserFavorites } from '../../firestore/users';

const HomeContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: #f5f5f5;
`;

function Home() {
    const { currentUser } = useAuth();
    const [favorites, setFavorites] = useState([]);

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
                <Routes>
                    <Route path="/" element={<Feed onFavoriteToggle={handleFavoriteToggle} favorites={favorites} />} />
                    <Route path="/favorites" element={<Favorites onFavoriteToggle={handleFavoriteToggle} />} />
                </Routes>
                <Rightbar />
            </HomeContainer>
        </>
    );
}

export default Home;