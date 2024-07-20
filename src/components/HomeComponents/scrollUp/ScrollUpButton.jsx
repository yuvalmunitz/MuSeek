import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled Scroll Up Button with image
const ScrollButton = styled.img`
    position: fixed;
    bottom: 50px;
    right: 50px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    opacity: ${props => (props.visible ? '1' : '0')};
    transition: opacity 0.3s;
`;

const ScrollUpButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <ScrollButton
            src='assets/scrollUpButton.png'
            onClick={scrollToTop}
            visible={isVisible}
            alt="Scroll Up"
        />
    );
};

export default ScrollUpButton;
