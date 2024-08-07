import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Post from "../post_l/Post_l";
import Share from "../share/Share";
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { useAuth } from '../../../firestore/AuthContext';

// Styled Components
const FeedContainer = styled.div`
  flex: 9;
  background-color: #f5f5f5; /* Light background for better contrast */
  padding: 20px;
  /* Remove scrolling properties */
`;

const FeedWrapper = styled.div`
  padding: 20px;
  background-color: #ffffff; /* White background for posts */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.01); /* Slightly enlarge on hover */
  }
`;

const Divider = styled.div`
  border-top: 2px solid #6d4c41; /* Better visual divider */
  margin: 20px 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #6d4c41;
  font-size: 1.2rem;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: red;
  font-size: 1.2rem;
  padding: 20px;
`;

function Feed({ onFavoriteToggle, favorites = [], sortType, selectedGenre }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const postsCollection = collection(db, "posts");
      const q = query(postsCollection, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedPosts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate() || new Date(),
        };
      });

      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts: ", error);
      setError("Failed to load posts. Please try again later.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser, fetchPosts]);

  const sortedPosts = useMemo(() => {
    let filtered = posts;

    // Filter by selected genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(post => post.genre === selectedGenre);
    }

    // Sort by type
    if (sortType === 'lyrics') {
      return filtered.filter(post => post.pdf != null);
    } else if (sortType === 'composition') {
      return filtered.filter(post => post.audio != null);
    } else {
      return filtered;
    }
  }, [posts, sortType, selectedGenre]);

  const handleNewPost = useCallback((newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);

  if (loading) {
    return <LoadingMessage>Loading posts...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
      <FeedContainer>
        <FeedWrapper>
          <Share onPostAdded={handleNewPost} />
          <Divider />
          {sortedPosts.map((post) => (
              <Post
                  key={post.id}
                  post={post}
                  onFavoriteToggle={onFavoriteToggle}
                  isFavorite={favorites.includes(post.id)}
              />
          ))}
        </FeedWrapper>
      </FeedContainer>
  );
}

Feed.defaultProps = {
  favorites: [],
};

export default Feed;