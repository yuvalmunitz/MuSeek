import React from 'react';
import styled from 'styled-components';
import { Users } from '../../dummyData';
import Online from '../online/Online';
import { Card, CardContent, Typography, Avatar, Box, Button } from '@mui/material';
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

export default function Rightbar({ profile, openFavorites }) {
  const HomeRightbar = () => {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Star />}
          style={{ backgroundColor: '#6d4c41', color: '#fff', marginBottom: '20px' }}
          onClick={openFavorites}
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

  const ProfileRightbar = () => {
    return (
      <>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About Me:
            </Typography>
            <ProfileInfoItem>
              <ProfileInfoKey>City</ProfileInfoKey>
              <ProfileInfoValue>New York</ProfileInfoValue>
            </ProfileInfoItem>
            <ProfileInfoItem>
              <ProfileInfoKey>Genres</ProfileInfoKey>
              <ProfileInfoValue>________</ProfileInfoValue>
            </ProfileInfoItem>
            <ProfileInfoItem>
              <ProfileInfoKey>My Music:</ProfileInfoKey>
              <ProfileInfoValue>________</ProfileInfoValue>
            </ProfileInfoItem>
          </CardContent>
        </Card>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            User Friends
          </Typography>
          <FriendsList>
            {Users.slice(0, 6).map((user) => (
              <Friend key={user.id}>
                <FriendAvatar src={user.profilePicture} />
                <Typography>{user.username}</Typography>
              </Friend>
            ))}
          </FriendsList>
        </Box>
      </>
    );
  };

  return (
    <RightbarContainer>
      <RightbarWrapper>
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </RightbarWrapper>
    </RightbarContainer>
  );
}