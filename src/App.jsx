import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { initiateSocketConnection, disconnectSocket } from './services/socket';

// Web App Pages
import LandingPage from './pages/LandingPage';
import LandingScreen from './pages/LandingScreen';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import Search from './pages/Search';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import CleanUsage from './pages/CleanUsage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          initiateSocketConnection(user.uid);
        } else {
          disconnectSocket();
        }
      } else {
        disconnectSocket();
      }
    });

    return () => {
      unsubscribe();
      disconnectSocket();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <div className="app-container">
            <LandingScreen />
          </div>
        } />
        <Route path="/signup" element={
          <div className="app-container">
            <Signup />
          </div>
        } />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/clean-usage" element={<CleanUsage />} />
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
