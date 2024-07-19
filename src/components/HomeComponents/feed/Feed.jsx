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

const Button = styled.button`
  margin: 5px;
  padding: 10px;
  background-color: ${props => props.selected ? '#6d4c41' : '#f1f1f1'};
  color: ${props => props.selected ? 'white' : 'black'};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.selected ? '#6d4c41' : '#ddd'};
  }
`;

function Feed({ onFavoriteToggle, favorites }) {
  const [posts, setPosts] = useState([]);
  const [sortedPosts, setSortedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const { currentUser } = useAuth();

  const allowedGenres = ["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Electronic", "Country", "R&B", "Folk", "Metal"];

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser, favorites]);

  useEffect(() => {
    sortPosts();
  }, [sortType, posts, selectedGenre]);

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
    let filtered = posts;

    // Filter by selected genre
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(post => post.genre === selectedGenre);
    }

    let sorted = [];
    if (sortType === 'lyrics') {
      sorted = filtered.filter(post => post.pdf != null);
    } else if (sortType === 'composition') {
      sorted = filtered.filter(post => post.audio != null);
    } else {
      sorted = filtered;
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
            <Button onClick={() => setSortType('all')} selected={sortType === 'all'}>All Posts</Button>
            <Button onClick={() => setSortType('lyrics')} selected={sortType === 'lyrics'}>Lyrics Posts</Button>
            <Button onClick={() => setSortType('composition')} selected={sortType === 'composition'}>Composition Posts</Button>
          </div>
          <div>
            <Button onClick={() => setSelectedGenre('all')} selected={selectedGenre === 'all'}>All Genres</Button>
            {allowedGenres.map(genre => (
                <Button key={genre} onClick={() => setSelectedGenre(genre)} selected={selectedGenre === genre}>{genre}</Button>
            ))}
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
