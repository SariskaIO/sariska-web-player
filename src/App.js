import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from './views/Home';
// import VCMeeting from './containers/videoConferecing/VCMeeting';
// import VideoConferencing from './views/VideoConferencing';
// import Leave from './views/Leave';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={
          <Navigate to='/' replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
