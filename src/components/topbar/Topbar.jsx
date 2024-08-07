// src/components/topbar/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../firestore/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Chat, Star, Home } from '@mui/icons-material';

const TopbarContainer = styled.div`
    height: 60px;
    width: 100%;
    background: linear-gradient(90deg, #6d4c41, #8d6e63);
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 999;
    padding: 0 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled.button`
    background-color: transparent;
    color: white;
    border: none;
    font-size: 14px;
    cursor: pointer;
    padding: 6px 12px;
    margin-right: 10px;
    transition: color 0.3s ease;

    &:hover {
        color: #d7ccc8;
    }
`;

const TopbarLeft = styled.div`
    flex: 3;
`;

const Logo = styled.span`
    font-size: 26px;
    margin-left: 20px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
        color: #d7ccc8;
    }
`;

const TopbarCenter = styled.div`
    flex: 5;
    display: flex;
    align-items: center;
`;

const TopbarRight = styled.div`
    flex: 4;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: white;
`;

const TopbarIcons = styled.div`
    display: flex;
    align-items: center;
`;

const TopbarIconItem = styled.div`
    margin-right: 10px;
    cursor: pointer;
    position: relative;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const TopbarImg = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    margin-left: 5px;
`;

const UnreadBadge = styled.span`
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 40px;
    right: 0;
    background-color: white;
    color: black;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
`;

const DropdownItem = styled.div`
    padding: 10px 20px;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
`;

export default function Topbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, signOut } = useAuth();
    const [imgError, setImgError] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const q = query(
                collection(db, 'posts'),
                where('userId', '==', currentUser.uid)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                let unreadCount = 0;
                snapshot.forEach((doc) => {
                    const commentsQuery = query(
                        collection(db, 'posts', doc.id, 'comments'),
                        where('isRead', '==', false)
                    );

                    onSnapshot(commentsQuery, (commentsSnapshot) => {
                        unreadCount += commentsSnapshot.size;
                        setUnreadMessages(unreadCount);
                    });
                });
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    const handleNavigation = () => {
        navigate('/Home');
    };

    const handleFavClick = () => {
        navigate('/Favorites');
    };

    const handleChatClick = () => {
        navigate('/Inbox');
    };

    const handleImageClick = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleImageError = () => {
        setImgError(true);
    };

    const handleLogoClick = () => {
        navigate('/Home');
    };

    const handleProfileClick = () => {
        navigate('/Profile');
        setDropdownOpen(false);
    };

    const handleLogoutClick = async () => {
        navigate('/Register');
        await signOut();
        setDropdownOpen(false);
    };

    return (
        <TopbarContainer>
            <TopbarLeft>
                <Logo onClick={handleLogoClick}>MuSeek</Logo>
            </TopbarLeft>
            <TopbarCenter>
            </TopbarCenter>
            <TopbarRight>
                {location.pathname !== '/Home' && (
                    <StyledButton onClick={handleNavigation}>
                        <Home />
                    </StyledButton>
                )}
                {location.pathname !== '/Favorites' && (
                    <StyledButton onClick={handleFavClick}>
                        <Star />
                    </StyledButton>
                )}
                {location.pathname !== '/Inbox' && (
                    <TopbarIcons>
                        <TopbarIconItem onClick={handleChatClick}>
                            <Chat />
                            {unreadMessages > 0 && (
                                <UnreadBadge>{unreadMessages}</UnreadBadge>
                            )}
                        </TopbarIconItem>
                    </TopbarIcons>
                )}
                {currentUser && (
                    <div style={{ position: 'relative' }}>
                        <TopbarImg
                            src={currentUser.photoURL}
                            alt={currentUser.displayName}
                            onError={handleImageError}
                            onClick={handleImageClick}
                        />
                        {dropdownOpen && (
                            <DropdownMenu>
                                <DropdownItem onClick={handleProfileClick}>Profile</DropdownItem>
                                <DropdownItem onClick={handleLogoutClick}>Logout</DropdownItem>
                            </DropdownMenu>
                        )}
                    </div>
                )}
            </TopbarRight>
        </TopbarContainer>
    );
}