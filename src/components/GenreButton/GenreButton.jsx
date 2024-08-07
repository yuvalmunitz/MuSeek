import React from 'react';
import styled from 'styled-components';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MicIcon from '@mui/icons-material/Mic';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import HeadsetIcon from '@mui/icons-material/Headset';
import Equalizer from '@mui/icons-material/Equalizer';
import Yard from '@mui/icons-material/Yard';
import ElectricBolt from '@mui/icons-material/ElectricBolt';
import Speaker from '@mui/icons-material/Speaker';
import Roofing from '@mui/icons-material/Roofing';
import {Flare} from '@material-ui/icons';

const Button = styled.button`
  margin: 5px;
  padding: 10px;
  background-color: ${props => props.selected ? '#6d4c41' : '#f1f1f1'};
  color: ${props => props.selected ? 'white' : 'black'};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 4px;

  &:hover {
    background-color: ${props => props.selected ? '#6d4c41' : '#ddd'};
  }
`;

const GenreIcon = styled.div`
  margin-right: 8px;
`;

export const genreIcons = {
    "Rock": <Flare />,
    "Pop": <Speaker />,
    "Jazz": <MusicNoteIcon />,
    "Classical": <LibraryMusicIcon />,
    "Hip Hop": <HeadsetIcon />,
    "Electronic": <Equalizer />,
    "Country": <Roofing />,
    "R&B": <MicIcon />,
    "Folk": <Yard />,
    "Metal": <ElectricBolt />,
};

const GenreButton = ({ genre, selected, onClick }) => (
    <Button onClick={onClick} selected={selected}>
        <GenreIcon>{genreIcons[genre]}</GenreIcon>
        {genre}
    </Button>
);

export default GenreButton;
