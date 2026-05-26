import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Heart, User, LogOut, Bell, Search, MessageCircle } from 'lucide-react';
import { auth } from '../firebase';
import { initiateSocketConnection, disconnectSocket } from '../services/socket';
import GlobalToast from './GlobalToast';

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        initiateSocketConnection(user.uid);
      } else {
        disconnectSocket();
        navigate('/');
      }
    });

    return () => {
      unsubscribe();
      disconnectSocket();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <Home size={24} /> },
    { name: 'Activity', path: '/activity', icon: <Bell size={24} /> },
    { name: 'Messages', path: '/matches', icon: <MessageCircle size={24} /> },
    { name: 'Profile', path: '/profile', icon: <User size={24} /> },
  ];

  return (
    <div className="layout-container">
      <GlobalToast />
      {/* Top App Bar for Mobile */}
      <header className="app-header">
        <div className="logo-container">
          <Heart size={28} color="var(--primary)" fill="var(--primary)" />
          <span className="gradient-text logo-text">LoveMitra</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav glass-card">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
