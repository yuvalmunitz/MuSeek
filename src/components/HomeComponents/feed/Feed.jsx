import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Post from "../post_l/Post_l";
import Share from "../share/Share";
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase-config';
import { useAuth } from '../../../firestore/AuthContext';

// Styled Components
const FeedContainer = styled.div`
  flex: 12;
`;

const FeedWrapper = styled.div`
  padding: 20px;
`;

function Feed({ onFavoriteToggle, favorites }) {
  const [posts, setPosts] = useState([]);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState('all');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser, favorites]);

  useEffect(() => {
    sortPosts();
  }, [sortType, posts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsCollection = collection(db, "posts");
      const q = query(postsCollection, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);

      let fetchedPosts = querySnapshot.docs.map(doc => {
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
  };

  const handleNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const sortPosts = () => {
    let sorted = [];
    if (sortType === 'lyrics') {
      sorted = posts.filter(post => post.pdf != null);
    } else if (sortType === 'composition') {
      sorted = posts.filter(post => post.audio != null);
    } else {
      sorted = posts;
    }
    setSortedPosts(sorted);
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
          <div>
            <button onClick={() => setSortType('all')}>All Posts</button>
            <button onClick={() => setSortType('lyrics')}>Lyrics Posts</button>
            <button onClick={() => setSortType('composition')}>Composition Posts</button>
          </div>
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

export default Feed;
