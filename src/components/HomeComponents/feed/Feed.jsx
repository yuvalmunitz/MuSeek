import React, { useState } from 'react';
import styled from 'styled-components';
import Post from "../post_l/Post_l";
import Share from "../share/Share";
import FavoritesPopup from '../favoritesPopup/FavoritesPopup';
import { Posts as initialPosts } from "../../../dummyData";

// Styled Components
const FeedContainer = styled.div`
  flex: 12;
`;

const FeedWrapper = styled.div`
  padding: 20px;
`;

// export default 
function Feed({ showFavorites, setShowFavorites, closeFavorites }) {
  const [posts, setPosts] = useState(initialPosts);
  const [favoritePosts, setFavoritePosts] = useState([]);

  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const toggleFavorite = (postId) => {
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post
    );
    setPosts(updatedPosts);
    
    const updatedFavorites = updatedPosts.filter(post => post.isFavorite);
    setFavoritePosts(updatedFavorites);
  };

  return (
    <FeedContainer>
      <FeedWrapper>
        <Share addNewPost={addNewPost} />
        {posts.map((p) => (
          <Post key={p.id} post={p} toggleFavorite={toggleFavorite} />
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
export default Feed