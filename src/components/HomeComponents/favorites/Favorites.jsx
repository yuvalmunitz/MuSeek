import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { useAuth } from '../../../firestore/AuthContext';
import Post from "../post_l/Post_l";
import Topbar from "../../topbar/Topbar";
import { removeFavorite } from '../../../firestore//users'; // Adjust the path as necessary

const theme = createTheme({
  palette: {
    primary: {
      main: '#6d4c41',
    },
    secondary: {
      main: '#6d4c41',
    },
  },
  shadows: ["none", ...Array(24).fill("0px 1px 3px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.12)")],
});

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#e0dcd2',
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: '50px', // Height of Topbar
}));

const FavoritesContainer = styled(Paper)(({ theme }) => ({
  width: '80%',
  margin: '0 auto',
  height: 'calc(100vh - 130px)', // Adjust for Topbar and padding
  borderRadius: 10,
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  backgroundColor: '#f5f5f5',
  color: '#3e2723',
  display: 'flex',
  flexDirection: 'column',
}));

const FavoritesHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: '#6d4c41',
  color: theme.palette.common.white,
}));

const FavoritesList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
}));

const EmptyMessage = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  color: '#6d4c41',
}));

function Favorites({ onFavoriteToggle }) {
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchFavoritePosts();
    }
  }, [currentUser]);

  const fetchFavoritePosts = async () => {
    if (!currentUser) {
      console.log("No current user");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching favorite posts for user:", currentUser.uid);
      
      // Fetch user's favorites
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) {
        console.log("User document not found");
        setLoading(false);
        return;
      }
      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      console.log("User's favorites:", favorites);

      if (favorites.length === 0) {
        console.log("No favorites found");
        setFavoritePosts([]);
        setLoading(false);
        return;
      }

      // Fetch posts
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("__name__", "in", favorites));
      const querySnapshot = await getDocs(q);
      
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? doc.data().date.toDate() : new Date(),
      }));

      console.log("Fetched posts:", posts);
      setFavoritePosts(posts);
    } catch (error) {
      console.error("Error fetching favorite posts:", error);
      setError("Failed to load favorite posts. Please try again later.");
    }
    setLoading(false);
  };

  const handleLocalFavoriteToggle = async (postId, isFavorite) => {
    try {
      if (isFavorite) {
        // Code to add to favorites (if needed)
      } else {
        await removeFavorite(currentUser.uid, postId);
        setFavoritePosts(prev => prev.filter(post => post.id !== postId));
      }
      onFavoriteToggle(postId, isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        <Topbar />
        <ContentContainer>
          <FavoritesContainer>
            <FavoritesHeader>
              <Typography variant="h6">Favorite Posts</Typography>
            </FavoritesHeader>
            <FavoritesList>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : error ? (
                <EmptyMessage variant="body1" color="error">
                  {error}
                </EmptyMessage>
              ) : favoritePosts.length === 0 ? (
                <EmptyMessage variant="body1">
                  You haven't added any posts to your favorites yet.
                </EmptyMessage>
              ) : (
                favoritePosts.map((post) => (
                  <Post 
                    key={post.id} 
                    post={post} 
                    onFavoriteToggle={handleLocalFavoriteToggle}
                    isFavorite={true}
                  />
                ))
              )}
            </FavoritesList>
            <Box p={1} textAlign="center">
              <Typography variant="caption" color="textSecondary">
                MuSeek
              </Typography>
            </Box>
          </FavoritesContainer>
        </ContentContainer>
      </PageContainer>
    </ThemeProvider>
  );
}

export default Favorites;
