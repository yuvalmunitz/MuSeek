// App.js
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Inbox from "./pages/inbox/Inbox";
import MusicPlayer from "./pages/musicPlayer/MusicPlayer";
import PDFReader from "./pages/pdfReader/PdfReader";
import OnBoarding1 from './pages/on_boarding/OnBoarding';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/OnBoarding" element={<OnBoarding1 />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Inbox" element={<Inbox />} />
      <Route path="/MusicPlayer" element={<MusicPlayer />} />
      <Route path="/PDFReader" element={<PDFReader />} />
    </Routes>
  );
}
 
// //2 Tests
// function App() {
//   return <Profile/>;
// }

// export default App;