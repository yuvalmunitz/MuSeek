import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Inbox from '../../components/inboxBase/InboxBase';
import Topbar from "../../components/topbar/Topbar";


const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea', // Purple color
    },
    secondary: {
      main: '#f50057', // Pink color
    },
  },
  shadows: ["none", ...Array(24).fill("0px 1px 3px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.12)")],
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Topbar />
      <Inbox />
      {/* Other components */}
    </ThemeProvider>
  );
}

export default App;