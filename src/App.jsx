import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Web App Pages
import LandingPage from './pages/LandingPage';
import LandingScreen from './pages/LandingScreen';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Search from './pages/Search';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <div className="app-container">
            <LandingScreen />
          </div>
        } />
        <Route element={<ProtectedRoute><div className="app-container"><Layout /></div></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
        </Route>
        <Route path="/chat/:chatId" element={
          <ProtectedRoute>
            <div className="app-container">
              <Chat />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
