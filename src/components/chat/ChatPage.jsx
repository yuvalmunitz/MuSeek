import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, List, ListItem, ListItemText, TextField, IconButton, Paper, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/system';

const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  justifyContent: 'space-between',
});

const MessageList = styled(List)({
  overflowY: 'auto',
  flexGrow: 1,
  padding: '10px',
});

const MessageInputContainer = styled(Box)({
  display: 'flex',
  padding: '10px',
  borderTop: '1px solid #ccc',
});

const Message = styled(Paper)(({ isSender }) => ({
  padding: '10px',
  margin: '10px 0',
  backgroundColor: isSender ? '#e1f5fe' : '#f1f8e9',
  alignSelf: isSender ? 'flex-end' : 'flex-start',
  maxWidth: '70%',
  display: 'flex',
  alignItems: 'center',
}));

const MessageAvatar = styled(Avatar)({
  marginRight: '10px',
});

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { text: 'Hi there!', sender: 'other' },
    { text: 'Hello! How are you?', sender: 'self' },
    { text: 'I am good, thank you! How about you?', sender: 'other' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, sender: 'self' }]);
      setNewMessage('');
    }
  };

  return (
    <ChatContainer>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Chat</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <MessageList>
          {messages.map((message, index) => (
            <ListItem key={index} disableGutters>
              <Message isSender={message.sender === 'self'}>
                {message.sender === 'other' && <MessageAvatar>A</MessageAvatar>}
                <ListItemText primary={message.text} />
              </Message>
            </ListItem>
          ))}
        </MessageList>
      </Container>
      <MessageInputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </MessageInputContainer>
    </ChatContainer>
  );
}