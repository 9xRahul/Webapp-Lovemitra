import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Web App Pages
import LandingScreen from './pages/LandingScreen';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Search from './pages/Search';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app-container">
            <LandingScreen />
          </div>
        } />
        <Route element={<div className="app-container"><Layout /></div>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
        </Route>
        <Route path="/chat/:chatId" element={
          <div className="app-container">
            <Chat />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
