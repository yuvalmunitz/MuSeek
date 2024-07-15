import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Post from "../post_l/Post_l";
import Share from "../share/Share";
import FavoritesPopup from '../favoritesPopup/FavoritesPopup';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';

// Styled Components
const FeedContainer = styled.div`
  flex: 12;
`;

const FeedWrapper = styled.div`
  padding: 20px;
`;
function Feed({ showFavorites, setShowFavorites, closeFavorites }) {
  const [posts, setPosts] = useState([]);
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsCollection = collection(db, "posts");
      console.log("Posts collection reference:", postsCollection);
  
      const q = query(postsCollection, orderBy("date", "desc"));
      console.log("Query:", q);
  
      const querySnapshot = await getDocs(q);
      console.log("Query snapshot:", querySnapshot);
  
      const fetchedPosts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Document data:", data);
        let formattedDate = 'Unknown date';
        
        if (data.date) {
          if (data.date.toDate && typeof data.date.toDate === 'function') {
            // It's a Firestore Timestamp
            formattedDate = data.date.toDate().toLocaleString();
          } else if (data.date instanceof Date) {
            // It's already a JavaScript Date object
            formattedDate = data.date.toLocaleString();
          } else if (typeof data.date === 'string') {
            // It's a string, try to parse it
            formattedDate = new Date(data.date).toLocaleString();
          } else if (typeof data.date === 'number') {
            // It's a timestamp in milliseconds
            formattedDate = new Date(data.date).toLocaleString();
          }
        }
  
        return {
          id: doc.id,
          ...data,
          date: formattedDate
        };
      });
  
      console.log("Fetched posts:", fetchedPosts);
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts: ", error);
      setError(`Failed to load posts. Error: ${error.message}`);
      setLoading(false);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts(prevPosts => [
      {
        ...newPost,
        audio: newPost.audio || null,
        pdf: newPost.pdf || null
      },
      ...prevPosts
    ]);
  };

  const toggleFavorite = (postId) => {
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post
    );
    setPosts(updatedPosts);
    
    const updatedFavorites = updatedPosts.filter(post => post.isFavorite);
    setFavoritePosts(updatedFavorites);
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <FeedContainer>
      <FeedWrapper>
        <Share onPostAdded={handleNewPost} />
        {posts.map((post) => (
          <Post key={post.id} post={post} toggleFavorite={toggleFavorite} />
        ))}
      </FeedWrapper>
      <FavoritesPopup
        open={showFavorites}
        onClose={closeFavorites}
        favoritePosts={favoritePosts}
      />
    </FeedContainer>
  );
}

export default Feed;