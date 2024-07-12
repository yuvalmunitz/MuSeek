import React from 'react';
import styled from 'styled-components';

const OnlineContainer = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const OnlineProfileImgContainer = styled.div`
  margin-right: 10px;
`;

const OnlineProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const OnlineUsername = styled.span`
  font-weight: 500;
`;

export default function Online({ user }) {
  return (
    <OnlineContainer>
      <OnlineProfileImgContainer>
        <OnlineProfileImg src={user.profilePicture} alt="" />
      </OnlineProfileImgContainer>
      <OnlineUsername>{user.username}</OnlineUsername>
    </OnlineContainer>
  );
}