import React from 'react';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { useAuth } from '../../firestore/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Chat } from '@mui/icons-material';
import { Star } from '@mui/icons-material';
import { Home } from '@mui/icons-material';

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

const FavoritesButton = styled(StyledButton)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    margin-right: 10px;
    transition: color 0.3s ease;

    &:hover {
        color: #d7ccc8;
    }
`;

const HomeButton = styled(StyledButton)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    margin-right: 10px;
    transition: color 0.3s ease;

    &:hover {
        color: #d7ccc8;
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

export default function Topbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth();
    const [imgError, setImgError] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);

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
        navigate('/Profile');
    };

    const handleImageError = () => {
        setImgError(true);
    };

    const handleLogoClick = () => {
        navigate('/Home');
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
                    <HomeButton onClick={handleNavigation}>
                        <Home />
                    </HomeButton>
                )}
                {location.pathname !== '/Favorites' && (
                    <FavoritesButton onClick={handleFavClick}>
                        <Star />
                    </FavoritesButton>
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
                    <TopbarImg
                        src={imgError ? 'https://example.com/default-avatar.png' : currentUser.photoURL}
                        alt={currentUser.displayName}
                        onError={handleImageError}
                        onClick={handleImageClick}
                    />
                )}
            </TopbarRight>
        </TopbarContainer>
    );
}