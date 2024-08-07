import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../firestore/AuthContext';
import { Users } from '../../dummyData';
import styled from 'styled-components';
import Online from '../online/Online';
import { Avatar, Button } from '@mui/material';
import { Star } from '@mui/icons-material';

const RightbarContainer = styled.div`
  border-radius: 10px;
  box-shadow: 0px 0px 16px -8px rgba(0, 0, 0, 0.68);
  flex: 3.5;
  background-color: #e0dcd2;
`;

const RightbarWrapper = styled.div`
  padding: 20px;
`;

const RightbarTitle = styled.h4`
  margin-bottom: 20px;
`;

const RightbarFriendList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const ProfileInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileInfoKey = styled.span`
  font-weight: 500;
  margin-right: 10px;
  color: #555;
`;

const ProfileInfoValue = styled.span`
  font-weight: 300;
`;

const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Friend = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const FriendAvatar = styled(Avatar)`
  margin-right: 10px;
`;

export default function Rightbar({ profile }) {
  const { currentUser } = useAuth();

  const HomeRightbar = () => {
    return (
      <>
       <Button
          component={Link}
          to="/favorites"
          variant="contained"
          color="primary"
          startIcon={<Star />}
          style={{ backgroundColor: '#6d4c41', color: '#fff', marginBottom: '20px' }}
        >
          Favorites
        </Button>

        <RightbarTitle>Explore Other Artists</RightbarTitle>
        <RightbarFriendList>
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </RightbarFriendList>
      </>
    );
  };


  return (
    <RightbarContainer>
      <RightbarWrapper>
        {profile ? <HomeRightbar /> : <HomeRightbar />}
      </RightbarWrapper>
    </RightbarContainer>
  );
}