import React from 'react';
import styled from 'styled-components';
import Topbar from '../../components/topbar/Topbar';
import Feed from '../../components/HomeComponents/feed/Feed';
import Rightbar from '../../components/rightbar/Rightbar';

const ProfileContainer = styled.div`
  display: flex;
`;

const ProfileRight = styled.div`
  flex: 15;
`;

const ProfileCover = styled.div`
  height: 320px;
  position: relative;
`;

const ProfileCoverImg = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const ProfileUserImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 150px;
  border: 3px solid white;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProfileInfoName = styled.h4`
  font-size: 24px;
`;

const ProfileInfoDesc = styled.span`
  font-weight: 300;
`;

const ProfileRightBottom = styled.div`
  display: flex;
`;

export default function Profile() {
  return (
    <>
      <Topbar />
      <ProfileContainer>
        {/* <Sidebar /> */}
        <ProfileRight>
          <div className="profileRightTop">
            <ProfileCover>
              <ProfileCoverImg
                src="assets/post/3.jpeg"
                alt=""
              />
              <ProfileUserImg
                src="assets/person/7.jpeg"
                alt=""
              />
            </ProfileCover>
            <ProfileInfo>
                <ProfileInfoName>Safak Kocaoglu</ProfileInfoName>
                <ProfileInfoDesc>I'm a jazz composer looking for lyricists to colab with!</ProfileInfoDesc>
            </ProfileInfo>
          </div>
          <ProfileRightBottom>
            <Feed />
            <Rightbar profile />
          </ProfileRightBottom>
        </ProfileRight>
      </ProfileContainer>
    </>
  );
}