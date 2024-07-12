import React, { useState } from 'react';
import { Box } from '@mui/material';
import CloudUpload from '@mui/icons-material/CloudUpload';
// import StyledButton from '../../components/musicPlayerDialog/StyledButton';
import MusicPlayerDialog from '../../components/musicPlayerDialog/MusicPlayerDialog';

import { Button , styled} from '@mui/material';

const StyledButton = styled(Button)({
  backgroundColor: '#6d4c41',
  color: 'white',
  '&:hover': {
    backgroundColor: '#5d4037',
  },
});

const MusicPlayer = () => {
  const [audioFile, setAudioFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setAudioFile(url);
  };

  const handleCloseDialog = () => {
    setAudioFile(null);
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', textAlign: 'center' }}>
      <input
        accept="audio/mp3"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="raised-button-file">
        <StyledButton variant="contained" component="span" startIcon={<CloudUpload />}>
          Upload MP3
        </StyledButton>
      </label>
      <MusicPlayerDialog audioFile={audioFile} onClose={handleCloseDialog} />
    </Box>
  );
};

export default MusicPlayer;