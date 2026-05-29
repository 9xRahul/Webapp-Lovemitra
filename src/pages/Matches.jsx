import React, { useEffect, useState } from 'react';
import { MessageCircle, Bell } from 'lucide-react';
import { ChatService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { auth } from '../firebase';
import { getSocket, initiateSocketConnection } from '../services/socket';

const Matches = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations(true);

    if (auth.currentUser) {
      initiateSocketConnection(auth.currentUser.uid);
      const socket = getSocket();
      
      const handleNewMessage = () => {
        fetchConversations(false);
      };

      socket.on('new_message', handleNewMessage);
      
      return () => {
        socket.off('new_message', handleNewMessage);
      };
    }
  }, []);

  const fetchConversations = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await ChatService.getConversations();
      if (res.data.status === 'success') {
        setConversations(res.data.data.conversations || []);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h1 className="page-title sticky-page-title">Messages</h1>

      <div className="matches-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingTop: '10px' }}>
        {loading ? (
          <LoadingSpinner text="Loading messages..." />
        ) : conversations.length === 0 ? (
          <div className="gradient-text" style={{ margin: 'auto' }}>No messages yet. Keep swiping!</div>
        ) : (
          <>
            {(() => {
              const myUid = auth.currentUser?.uid;
              // Guessing backend schema for message requests. Often status is pending and we are not the sender.
              const messageRequests = conversations.filter(conv => 
                conv.match && 
                (conv.match.status === 'pending' || conv.match.isRequest || conv.isRequest) &&
                conv.match.senderId !== myUid
              );
              
              const activeMessages = conversations.filter(conv => !messageRequests.includes(conv));

              return (
                <>
                  {/* Message Requests Section */}
                  {messageRequests.length > 0 && (
                    <div style={{ marginBottom: '25px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', padding: '0 5px' }}>
                        <Bell size={18} color="#ff4b82" />
                        <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'white', fontWeight: '600' }}>Message Requests ({messageRequests.length})</h2>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messageRequests.map((conv) => {
                          const { match, otherUser } = conv;
                          if (!match || !otherUser) return null;
                          return (
                            <div 
                              key={match.chatId} 
                              className="match-item glass-card" 
                              style={{ cursor: 'pointer', border: '1px solid rgba(255, 75, 130, 0.3)', background: 'linear-gradient(145deg, rgba(255,75,130,0.05), rgba(0,0,0,0.4))' }}
                              onClick={() => navigate(`/chat/${match.chatId}`, { state: { otherUser } })}
                            >
                              <div className="match-avatar" style={{ overflow: 'hidden' }}>
                                {otherUser.photos && otherUser.photos.length > 0 ? (
                                  <img src={otherUser.photos[0]} alt={otherUser.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : null}
                              </div>
                              <div className="match-details">
                                <h3 style={{ color: '#ff4b82' }}>{otherUser.first_name || 'User'}{otherUser.age ? `, ${otherUser.age}` : ''}</h3>
                                <p style={{ color: '#fff', fontWeight: '500' }}>
                                  Sent you a message request
                                </p>
                              </div>
                              <div style={{ background: '#ff4b82', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>
                                NEW
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Active Messages Section */}
                  {activeMessages.length > 0 && (
                    <div>
                      {messageRequests.length > 0 && (
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#aaa', fontWeight: '500', padding: '0 5px' }}>Active Conversations</h2>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {activeMessages.map((conv) => {
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
                                <h3>{otherUser.first_name || 'Match'}{otherUser.age ? `, ${otherUser.age}` : ''}</h3>
                                <p>{match.unseenCount && match.unseenCount[myUid] > 0 ? 'New message' : ''}</p>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {match.unseenCount && match.unseenCount[myUid] > 0 && (
                                  <div style={{ background: '#ff4b82', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' }}>
                                    {match.unseenCount[myUid]}
                                  </div>
                                )}
                                <button className="icon-btn chat-btn">
                                  <MessageCircle size={24} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default Matches;
