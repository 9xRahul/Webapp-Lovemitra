import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSocket } from '../services/socket';
import { Bell, Heart, MessageCircle, Eye, Sparkles, X } from 'lucide-react';
import { auth } from '../firebase';

const GlobalToast = () => {
  const [toasts, setToasts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const socket = getSocket();
    if (!socket) return;

    const addToast = (toast) => {
      const id = Date.now().toString();
      setToasts(prev => [...prev, { ...toast, id }]);
      
      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    const triggerBrowserNotification = (title, body) => {
      // Only show native notification if the document is hidden/backgrounded
      if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
        new Notification(title, { body, icon: '/vite.svg' });
      }
    };

    const handleProfileVisit = (data) => {
      const title = 'New Visitor';
      const body = `${data.fromUser?.first_name || 'Someone'} visited your profile!`;
      
      triggerBrowserNotification(title, body);
      addToast({
        title,
        message: body,
        icon: <Eye size={20} color="#ff4b82" />,
        onClick: () => navigate('/activity')
      });
    };

    const handleLikeReceived = (data) => {
      const title = 'New Like';
      const body = `${data.fromUser?.first_name || 'Someone'} liked your profile!`;
      
      triggerBrowserNotification(title, body);
      addToast({
        title,
        message: body,
        icon: <Heart size={20} color="#4bff94" fill="#4bff94" />,
        onClick: () => navigate('/activity')
      });
    };

    const handleMatchCreatedReceiver = (data) => {
      const title = "It's a Match!";
      const body = `You matched with ${data.matchedUser?.first_name}!`;
      
      triggerBrowserNotification(title, body);
      addToast({
        title,
        message: body,
        icon: <Sparkles size={20} color="#ff8c4b" fill="#ff8c4b" />,
        onClick: () => navigate('/matches')
      });
    };

    const handleMatchCreatedActor = (data) => {
      const title = "It's a Match!";
      const body = `You and ${data.matchedUser?.first_name} liked each other!`;
      
      triggerBrowserNotification(title, body);
      addToast({
        title,
        message: body,
        icon: <Sparkles size={20} color="#ff8c4b" fill="#ff8c4b" />,
        onClick: () => navigate(`/chat/${data.match.chatId}`)
      });
    };

    const handleNewMessage = (payload) => {
      // Don't show toast if we are currently looking at this specific chat
      if (location.pathname === `/chat/${payload.chatId}` && payload.message.senderId !== auth.currentUser?.uid) {
        return;
      }
      
      // Also ignore our own messages
      if (payload.message.senderId === auth.currentUser?.uid) return;

      const title = `New Message from ${payload.senderName || 'Match'}`;
      const body = "Sent you a message";
      
      triggerBrowserNotification(title, body);
      addToast({
        title,
        message: body,
        icon: <MessageCircle size={20} color="#4b9fff" />,
        onClick: () => navigate(`/chat/${payload.chatId}`)
      });
    };

    socket.on('profile_visit', handleProfileVisit);
    socket.on('like_received', handleLikeReceived);
    socket.on('match_created_for_receiver', handleMatchCreatedReceiver);
    socket.on('match_created_for_actor', handleMatchCreatedActor);
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('profile_visit', handleProfileVisit);
      socket.off('like_received', handleLikeReceived);
      socket.off('match_created_for_receiver', handleMatchCreatedReceiver);
      socket.off('match_created_for_actor', handleMatchCreatedActor);
      socket.off('new_message', handleNewMessage);
    };
  }, [location.pathname, navigate]);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: '90%',
      maxWidth: '400px',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div 
          key={toast.id}
          style={{
            background: 'rgba(25, 25, 28, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            animation: 'slideDown 0.3s ease-out forwards'
          }}
          onClick={() => {
            if (toast.onClick) toast.onClick();
            setToasts(prev => prev.filter(t => t.id !== toast.id));
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {toast.icon}
          </div>
          
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'white', fontWeight: '600' }}>{toast.title}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {toast.message}
            </p>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setToasts(prev => prev.filter(t => t.id !== toast.id));
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default GlobalToast;
