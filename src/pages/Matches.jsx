import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const Matches = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await ChatService.getConversations();
      if (res.data.status === 'success') {
        setConversations(res.data.data.conversations || []);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Matches..." />;

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h1 className="page-title">Messages</h1>

      <div className="matches-list" style={{ flex: 1, overflowY: 'auto' }}>
        {conversations.length === 0 ? (
          <div className="gradient-text">No matches yet. Keep swiping!</div>
        ) : (
          conversations.map((conv) => {
            const { match, otherUser } = conv;
            if (!match || !otherUser) return null;
            
            return (
              <div 
                key={match.chatId} 
                className="match-item glass-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/chat/${match.chatId}`, { state: { otherUser } })}
              >
                <div className="match-avatar" style={{ overflow: 'hidden' }}>
                  {otherUser.photos && otherUser.photos.length > 0 ? (
                    <img src={otherUser.photos[0]} alt={otherUser.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : null}
                </div>
                <div className="match-details">
                  <h3>{otherUser.first_name || 'Match'}, {otherUser.age || ''}</h3>
                  <p>{match.lastMessage || 'Tap to chat'}</p>
                </div>
                <button className="icon-btn chat-btn">
                  <MessageCircle size={24} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Matches;
