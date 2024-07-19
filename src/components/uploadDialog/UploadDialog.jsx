// // UploadDialog.jsx
// import React from 'react';
// import React, { useState } from 'react';
// import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

// export default function UploadDialog({ open, onClose, onUpload, fileType }) {
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>{`Upload ${fileType === 'pdf' ? 'PDF' : 'MP3'} File`}</DialogTitle>
//       <DialogContent>
//         <DialogContentText>
//           Please select a {fileType === 'pdf' ? 'PDF' : 'MP3'} file to upload.
//         </DialogContentText>
//         <TextField
//           autoFocus
//           margin="dense"
//           type="file"
//           fullWidth
//           inputProps={{ accept: fileType === 'pdf' ? 'application/pdf' : 'audio/mp3' }}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Cancel
//         </Button>
//         <Button onClick={onUpload} color="primary">
//           Upload
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

export default function UploadDialog({ open, onClose, onUpload, fileType }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    } else {
      alert('Please select a file to upload.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Upload ${fileType === 'pdf' ? 'PDF' : 'MP3'} File`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please select a {fileType === 'pdf' ? 'PDF' : 'MP3'} file to upload.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          type="file"
          fullWidth
          inputProps={{ accept: fileType === 'pdf' ? 'application/pdf' : 'audio/mp3' }}
          onChange={handleFileChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUploadClick} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );

