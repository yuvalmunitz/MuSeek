// import React, { useState } from 'react';
// import styled from 'styled-components';
// import Post from "../post_l/Post_l";
// import Share from "../share/Share";
// import FavoritesPopup from '../favoritesPopup/FavoritesPopup';
// import { Posts as initialPosts } from "../../../dummyData";

// // Styled Components
// const FeedContainer = styled.div`
//   flex: 12;
// `;

// const FeedWrapper = styled.div`
//   padding: 20px;
// `;

// // export default 
// function Feed({ showFavorites, setShowFavorites, closeFavorites }) {
//   const [posts, setPosts] = useState(initialPosts);
//   const [favoritePosts, setFavoritePosts] = useState([]);

//   const addNewPost = (newPost) => {
//     setPosts([newPost, ...posts]);
//   };

//   const toggleFavorite = (postId) => {
//     const updatedPosts = posts.map(post => 
//       post.id === postId ? { ...post, isFavorite: !post.isFavorite } : post
//     );
//     setPosts(updatedPosts);
    
//     const updatedFavorites = updatedPosts.filter(post => post.isFavorite);
//     setFavoritePosts(updatedFavorites);
//   };

//   return (
//     <FeedContainer>
//       <FeedWrapper>
//         <Share addNewPost={addNewPost} />
//         {posts.map((p) => (
//           <Post key={p.id} post={p} toggleFavorite={toggleFavorite} />
//         ))}
//       </FeedWrapper>
//       <FavoritesPopup 
//         open={showFavorites} 
//         onClose={closeFavorites} 
//         favoritePosts={favoritePosts} 
//       />
//     </FeedContainer>
//   );
// }
// export default Feed



import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Post from "../post_l/Post_l";
import Share from "../share/Share";
import FavoritesPopup from '../favoritesPopup/FavoritesPopup';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("date", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts: ", error);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
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
        <Share onPostAdded={handleNewPost} />
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

export default Feed;