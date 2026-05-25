import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './website.css';

// Marketing Pages
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CleanUsage from './pages/CleanUsage';
import FAQ from './pages/FAQ';
import ScrollToTop from './components/ScrollToTop';

// Web App Pages
import LandingScreen from './pages/LandingScreen';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Marketing Site Routes */}
        <Route path="/" element={<div className="marketing-site"><Home /></div>} />
        <Route path="/faq" element={<div className="marketing-site"><FAQ /></div>} />
        <Route path="/privacy" element={<div className="marketing-site"><Privacy /></div>} />
        <Route path="/terms" element={<div className="marketing-site"><Terms /></div>} />
        <Route path="/clean-usage" element={<div className="marketing-site"><CleanUsage /></div>} />

        {/* Web App Routes */}
        <Route path="/login" element={
          <div className="app-container">
            <LandingScreen />
          </div>
        } />
        <Route element={<div className="app-container"><Layout /></div>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/profile" element={<Profile />} />
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
