import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { CloudUpload, Close as CloseIcon } from '@mui/icons-material';

const Container = styled.div`
  text-align: center;
  margin-top: 32px;
`;

const UploadButton = styled(Button)`
  background-color: #6d4c41;
  color: white;

  &:hover {
    background-color: #6d4c41;
  }
`;

const StyledDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    background-color: #6d4c41;
    color: white;
  }

  .MuiDialogContent-root {
    padding: 24px;
  }

  .MuiDialogActions-root {
    padding: 16px;
  }
`;

const PDFContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  color: white;
`;

const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [open, setOpen] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
      setOpen(true);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPdfUrl('');
  };

  return (
    <Container>
      <input
        type="file"
        accept="application/pdf"
        id="upload-pdf"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-pdf">
        <UploadButton
          style={{ backgroundColor: '#6d4c41', color: 'white' }}
          variant="contained"
          component="span"
          startIcon={<CloudUpload />}
        >
          Upload Your Lyrics
        </UploadButton>
      </label>

      <StyledDialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="pdf-dialog-title"
      >
        <DialogTitle id="pdf-dialog-title">
          PDF Viewer
          <CloseButton
            aria-label="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </CloseButton>
        </DialogTitle>
        <DialogContent dividers>
          {pdfUrl ? (
            <PDFContainer>
              <iframe 
                src={pdfUrl} 
                width="100%" 
                height="600px" 
                style={{ border: 'none' }}
                title="PDF Viewer"
              />
            </PDFContainer>
          ) : (
            <div style={{ marginTop: '16px', color: '#6d4c41' }}>
              No PDF uploaded yet.
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ backgroundColor: '#6d4c41', color: 'white' }}>
            Close
          </Button>
        </DialogActions>
      </StyledDialog>
    </Container>
  );
};

export default PDFViewer;
