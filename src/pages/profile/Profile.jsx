import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Topbar from "../../components/topbar/Topbar";
import styled from 'styled-components';
import { useAuth } from '../../firestore/AuthContext';
import { getOrCreateUser } from '../../firestore/users';
import OnBoarding from '../on_boarding/OnBoarding';
import { genreIcons } from '../../components/GenreButton/GenreButton';

const ProfileContainer = styled.div`
    display: flex;
    padding: 20px;
    background-color: #f5f5f5;
`;

const ProfileRight = styled.div`
    flex: 15;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileCover = styled.div`
    height: 320px;
    position: relative;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/assets/post/3.jpeg') center/cover no-repeat;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    gap: 10px;
`;

const ProfileInfoName = styled.h4`
    font-size: 24px;
    font-weight: bold;
    color: #333;
`;

const ProfileEmail = styled.span`
    font-weight: 300;
    color: #777;
`;

const ProfileDetail = styled.p`
    font-size: 16px;
    color: #555;
    margin: 5px 0;
`;

const ProfileRightBottom = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px;
    margin-top: 20px;
`;

const Button = styled.button`
    margin: 5px;
    padding: 10px 20px;
    background-color: #6d4c41;
    color: white;
    font-size: 18px; /* Enlarged font size */
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px; /* Gap between text and icon */

    &:hover {
        background-color: #5a3c33;
    }
`;

const genres = ["Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Electronic", "Country", "R&B", "Folk", "Metal"];

export default function Profile() {
    const [showOnBoarding, setShowOnBoarding] = useState(false);
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            getOrCreateUser(currentUser.uid).then(data => setUserData(data));
        }
    }, [currentUser]);

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
    };

    return (
        <>
            <Topbar />
            <ProfileContainer>
                <ProfileRight>
                    <div className="profileRightTop">
                        <ProfileCover>
                            <ProfileUserImg
                                src={currentUser?.photoURL || "assets/person/7.jpeg"}
                                alt=""
                            />
                        </ProfileCover>
                        <ProfileInfo>
                            <ProfileInfoName>{userData?.displayName || "User Name"}</ProfileInfoName>
                            <ProfileEmail>{userData?.email || "User Email Address"}</ProfileEmail>
                            <ProfileDetail>Posts: {userData?.posts?.length || 0}</ProfileDetail>
                            <ProfileDetail>Favorites: {userData?.favorites?.length || 0}</ProfileDetail>
                            <ProfileDetail>User Type: {userData?.userType || "No user type available"}</ProfileDetail>
                            <ProfileDetail>Performer: {userData?.performer || "No performer status available"}</ProfileDetail>
                            <ProfileDetail>Recorder: {userData?.recorder || "No recorder status available"}</ProfileDetail>
                            <ProfileDetail>Experience: {userData?.experience || "No experience available"}</ProfileDetail>
                            <ProfileDetail>
                                Genres:
                                {userData?.genres?.length ? (
                                    userData.genres.map((genre) => (
                                            <span key={genre} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            {genreIcons[genre]} {genre}
                                          </span>
                                    ))
                                ) : (
                                    "No genres available"
                                )}
                            </ProfileDetail>
                            <Button onClick={() => setShowOnBoarding(!showOnBoarding)}>
                                {showOnBoarding ? 'Hide Profile Form' : 'Show Profile Form'}
                            </Button>
                        </ProfileInfo>
                    </div>
                    <ProfileRightBottom>
                        {showOnBoarding ? <OnBoarding /> : null}
                    </ProfileRightBottom>
                </ProfileRight>
            </ProfileContainer>
        </>
    );
}