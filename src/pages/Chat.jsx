import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChatService, UserService } from '../services/api';
import { getSocket, initiateSocketConnection } from '../services/socket';
import { auth } from '../firebase';
import { ArrowLeft, Send, Smile, Camera, X, CheckCheck, Check, Heart, MessageSquare, MoreVertical, ShieldBan, AlertTriangle, UserX } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { MatchingService } from '../services/api';
import ConfirmActionModal from '../components/ConfirmActionModal';
import ReportUserModal from '../components/ReportUserModal';
import LoadingSpinner from '../components/LoadingSpinner';

const ExpiringImage = ({ src, msgId, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire(msgId);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, msgId, onExpire]);

  return (
    <div style={{ position: 'relative' }}>
      <img src={src} alt="Attachment" style={{ width: '100%', borderRadius: '10px' }} />
      <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '12px', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>{timeLeft}s</span>
      </div>
    </div>
  );
};

const Chat = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [otherUser, setOtherUser] = useState(location.state?.otherUser || null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [isOnline, setIsOnline] = useState(otherUser?.isOnline || false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Modals state
  const [showMenu, setShowMenu] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showUnmatchConfirm, setShowUnmatchConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const fetchMessages = async (isLoadMore = false) => {
    if (isLoadMore && (!hasMore || loadingMore)) return;
    
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      let before = '';
      if (isLoadMore && messages.length > 0) {
        before = messages[0].createdAt || messages[0].timestamp;
      }
      const res = await ChatService.getMessages(chatId, before);
      if (res.data.status === 'success') {
        const fetchedMessages = res.data.data.messages || [];
        if (fetchedMessages.length < 30) setHasMore(false);
        
        const newMessages = fetchedMessages.reverse();
        
        if (isLoadMore) {
          const container = scrollContainerRef.current;
          const prevScrollHeight = container ? container.scrollHeight : 0;
          
          setMessages(prev => [...newMessages, ...prev]);
          
          setTimeout(() => {
            if (container) {
              container.scrollTop = container.scrollHeight - prevScrollHeight;
            }
          }, 0);
        } else {
          setMessages(newMessages);
          setTimeout(() => scrollToBottom(), 0);
        }
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    // To hold the socket reference for cleanup
    let activeSocket = null;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchMessages();
        
        if (!otherUser) {
          // Extract other user's ID from chatId (which is usually uid1_uid2)
          const uids = chatId.split('_');
          const otherId = uids.find(id => id !== user.uid);
          if (otherId) {
            UserService.getUserById(otherId).then(res => {
              if (res.data?.status === 'success') {
                setOtherUser(res.data.data.user);
                setIsOnline(res.data.data.user.isOnline);
              }
            }).catch(err => console.error("Failed to fetch user", err));
          }
        }

        // Initialize socket if Layout hasn't done it yet due to race condition
        let socket = getSocket();
        if (!socket) {
          initiateSocketConnection(user.uid);
          socket = getSocket();
        }
        
        activeSocket = socket;

        if (socket) {
          socket.emit('join_chat', chatId);
          
          const handleNewMessage = (payload) => {
            if (payload.chatId === chatId) {
              setMessages(prev => {
                const existingIndex = prev.findIndex(m => 
                  (payload.message.clientId && m.clientId === payload.message.clientId) || 
                  (m.content === payload.message.content && Date.now() - new Date(m.createdAt).getTime() < 5000)
                );
                
                if (existingIndex !== -1) {
                  const newMsgs = [...prev];
                  newMsgs[existingIndex] = payload.message;
                  return newMsgs;
                }
                return [...prev, payload.message];
              });
              
              if (payload.message.senderId !== user.uid) {
                socket.emit('message_seen', { messageId: payload.message._id, senderUid: payload.message.senderId });
              }
            }
          };

          const handleStatusChange = (data) => {
            const uids = chatId.split('_');
            const otherId = uids.find(id => id !== user.uid);
            if (data.uid === otherId) {
              setIsOnline(data.isOnline);
            }
          };

          const handleUserTyping = (data) => {
            const uids = chatId.split('_');
            const otherId = uids.find(id => id !== user.uid);
            if (data.senderUid === otherId) {
              setIsTyping(data.isTyping);
            }
          };

          const handleMessageStatus = (data) => {
            setMessages(prev => prev.map(msg => 
              msg._id === data.messageId ? { ...msg, status: data.status, readAt: data.seenAt } : msg
            ));
          };

          const handleMessagesRead = (data) => {
            if (data.chatId === chatId) {
              setMessages(prev => prev.map(msg => 
                msg.senderId === user.uid ? { ...msg, status: 'read' } : msg
              ));
            }
          };

          socket.on('new_message', handleNewMessage);
          socket.on('user_status_change', handleStatusChange);
          socket.on('user_typing', handleUserTyping);
          socket.on('message_status_update', handleMessageStatus);
          socket.on('messages_read', handleMessagesRead);

          // Save references to cleanup specifically
          activeSocket.handlers = {
            handleNewMessage,
            handleStatusChange,
            handleUserTyping,
            handleMessageStatus,
            handleMessagesRead
          };
        }
      }
    });
    
    // Mark existing messages as read
    ChatService.markAsRead(chatId).catch(err => console.error("Failed to mark as read", err));

    return () => {
      unsubscribe();
      if (activeSocket) {
        activeSocket.emit('leave_chat');
        if (activeSocket.handlers) {
          activeSocket.off('new_message', activeSocket.handlers.handleNewMessage);
          activeSocket.off('user_status_change', activeSocket.handlers.handleStatusChange);
          activeSocket.off('user_typing', activeSocket.handlers.handleUserTyping);
          activeSocket.off('message_status_update', activeSocket.handlers.handleMessageStatus);
          activeSocket.off('messages_read', activeSocket.handlers.handleMessagesRead);
        }
      }
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop } = scrollContainerRef.current;
      if (scrollTop === 0 && !loading && !loadingMore && hasMore) {
        fetchMessages(true);
      }
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    
    const socket = getSocket();
    if (socket && otherUser) {
      socket.emit('typing', { receiverUid: otherUser.uid, isTyping: true });
      
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { receiverUid: otherUser.uid, isTyping: false });
      }, 1500);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !selectedImage) return;

    try {
      const clientId = Date.now().toString();
      let payload;
      let tempContent = text;
      let msgType = 'text';

      if (selectedImage) {
        payload = new FormData();
        payload.append('chatId', chatId);
        payload.append('receiverId', otherUser?.uid);
        payload.append('type', 'photo');
        payload.append('clientId', clientId);
        if (text.trim()) payload.append('content', text);
        payload.append('file', selectedImage);
        
        tempContent = URL.createObjectURL(selectedImage);
        msgType = 'photo';
      } else {
        payload = { chatId, content: text, receiverId: otherUser?.uid, type: 'text', clientId };
      }

      // Optimistic UI
      const tempMsg = { _id: clientId, clientId, senderId: auth.currentUser?.uid || 'me', content: tempContent, type: msgType, createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, tempMsg]);
      setText('');
      setSelectedImage(null);
      setTimeout(() => scrollToBottom(), 0);

      await ChatService.sendMessage(payload);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleQuickSend = async (quickText) => {
    try {
      const payload = { chatId, content: quickText, receiverId: otherUser?.uid, type: 'text' };
      const tempMsg = { _id: Date.now().toString(), senderId: auth.currentUser?.uid || 'me', content: quickText, type: 'text', createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, tempMsg]);
      setTimeout(() => scrollToBottom(), 0);
      await ChatService.sendMessage(payload);
    } catch (err) {
      console.error("Failed to send quick message", err);
    }
  };

  const handleUnmatch = async () => {
    if (!otherUser?.uid) return;
    setIsProcessing(true);
    try {
      await MatchingService.unmatchUser(otherUser.uid);
      setShowUnmatchConfirm(false);
      navigate('/matches');
    } catch (err) {
      console.error("Failed to unmatch user", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBlock = async () => {
    if (!otherUser?.uid) return;
    setIsProcessing(true);
    try {
      await MatchingService.blockUser(otherUser.uid);
      setShowBlockConfirm(false);
      navigate('/matches');
    } catch (err) {
      console.error("Failed to block user", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReport = async (reportData) => {
    if (!otherUser?.uid) return;
    setIsProcessing(true);
    try {
      await MatchingService.reportUser({
        targetUid: otherUser.uid,
        ...reportData
      });
      setShowReportModal(false);
      navigate('/matches');
    } catch (err) {
      console.error("Failed to report user", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden', width: '100%' }}>
      {/* Top App Bar for Mobile */}
      <header className="app-header">
        <div className="logo-container">
          <Heart size={28} color="var(--primary)" fill="var(--primary)" />
          <span className="gradient-text logo-text">LoveMitra</span>
        </div>
      </header>

      <div style={{ flex: 1, maxWidth: '400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        
        {/* Chat User Title */}
        <div className="chat-sticky-header">
          <button className="icon-btn" onClick={() => navigate(-1)} style={{ padding: 0 }}><ArrowLeft size={24} /></button>
          
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--primary)', flexShrink: 0 }}>
            {otherUser?.photos && otherUser.photos.length > 0 ? (
              <img src={otherUser.photos[0]} alt="DP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {otherUser?.first_name?.charAt(0) || '?'}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, textAlign: 'left', fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', flexDirection: 'column' }}>
            {otherUser?.first_name || 'Match'}
            <div style={{ fontSize: '0.8rem', color: isTyping ? '#ff4b82' : (isOnline ? '#4bff94' : '#888'), fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.3s' }}>
              {isTyping ? (
                <>Typing<span className="typing-dots">...</span></>
              ) : (
                <>
                  {isOnline && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4bff94', display: 'inline-block' }}></span>}
                  {isOnline ? 'Online' : 'Offline'}
                </>
              )}
            </div>
          </div>

          {/* 3-dots menu */}
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowMenu(!showMenu)} style={{ padding: 0 }}>
              <MoreVertical size={24} />
            </button>
            
            {showMenu && (
              <>
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} onClick={() => setShowMenu(false)} />
                <div style={{ position: 'absolute', top: '40px', right: '0', background: '#1c1c1e', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 5px 20px rgba(0,0,0,0.5)', width: '180px', zIndex: 100, overflow: 'hidden' }}>
                  <button onClick={() => { setShowMenu(false); setShowUnmatchConfirm(true); }} style={{ width: '100%', padding: '12px 15px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', cursor: 'pointer' }}>
                    <UserX size={16} /> Unmatch
                  </button>
                  <button onClick={() => { setShowMenu(false); setShowBlockConfirm(true); }} style={{ width: '100%', padding: '12px 15px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#ff4b4b', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', cursor: 'pointer' }}>
                    <ShieldBan size={16} /> Block User
                  </button>
                  <button onClick={() => { setShowMenu(false); setShowReportModal(true); }} style={{ width: '100%', padding: '12px 15px', background: 'transparent', border: 'none', color: '#ff4b4b', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', cursor: 'pointer' }}>
                    <AlertTriangle size={16} /> Report User
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="no-scrollbar"
        style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingSpinner text="Loading messages..." />
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <div style={{
                  background: '#1a1a1c',
                  borderRadius: '25px',
                  padding: '30px 25px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.03)',
                  width: '80%',
                  maxWidth: '280px'
                }}>
                  <MessageSquare size={48} color="#ff1f5a" strokeWidth={1.5} style={{ marginBottom: '15px' }} />
                  <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 'bold' }}>Fresh Start!</h3>
                  <p style={{ color: '#888', margin: '0 0 25px 0', fontSize: '0.95rem', textAlign: 'center' }}>
                    Ready to say hello again?
                  </p>
                  
                  <button 
                    onClick={() => handleQuickSend('Hii 🖐️')}
                    style={{
                      background: 'linear-gradient(90deg, #ff1f5a, #ff8c4b)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '12px 30px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    Say Hi 👋
                  </button>
                </div>
              </div>
            ) : (
              <>
                {loadingMore && (
                  <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.8rem', color: '#888' }}>
                    Loading older messages...
                  </div>
                )}
                {!hasMore && (
                  <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.8rem', color: '#888' }}>
                    Start of conversation
                  </div>
                )}
              </>
            )}
            
            {messages.map((msg) => {
              const isMe = msg.senderId === 'me' || msg.senderId === auth.currentUser?.uid;
          const timeVal = msg.timestamp || msg.createdAt;
          const timeString = timeVal ? new Date(timeVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

          return (
            <div key={msg._id} style={{ 
              alignSelf: isMe ? 'flex-end' : 'flex-start',
              background: isMe ? 'var(--primary)' : 'var(--glass-bg)',
              color: isMe ? 'white' : 'inherit',
              padding: '8px 12px',
              borderRadius: '16px',
              maxWidth: '75%',
              wordBreak: 'break-word',
              border: isMe ? 'none' : '1px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ marginBottom: '2px' }}>
                {msg.type === 'photo' || msg.type === 'image' || (msg.content && msg.content.startsWith('http')) ? (
                  <ExpiringImage 
                    src={msg.content} 
                    msgId={msg._id} 
                    onExpire={async (id) => {
                      setMessages(prev => prev.filter(m => m._id !== id));
                      try {
                        await ChatService.deleteMessage(id);
                      } catch (err) {
                        console.error('Failed to delete expired message', err);
                      }
                    }}
                  />
                ) : (
                  msg.content || ''
                )}
              </div>
              <div style={{ 
                fontSize: '0.65rem', 
                alignSelf: 'flex-end', 
                opacity: 0.8, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px' 
              }}>
                {timeString}
                {isMe && (
                   msg.status === 'read' ? (
                     <CheckCheck size={14} color="#4b9fff" />
                   ) : (
                     <Check size={14} color="rgba(255,255,255,0.6)" />
                   )
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Image Preview Area */}
      {selectedImage && (
        <div style={{ padding: '10px', background: '#1c1c1e', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden' }}>
            <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              type="button" 
              onClick={() => setSelectedImage(null)}
              style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', color: 'white', padding: '2px', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="chat-sticky-footer" style={{ borderTop: '1px solid var(--glass-border)' }}>
        {/* Emoji Picker Popup */}
        {showEmojiPicker && (
          <div style={{ position: 'absolute', bottom: '100%', left: '15px', marginBottom: '10px', zIndex: 100 }}>
            <EmojiPicker 
              theme="dark" 
              onEmojiClick={(emojiData) => {
                setText(prev => prev + emojiData.emoji);
                setShowEmojiPicker(false);
              }} 
            />
          </div>
        )}

        <form onSubmit={handleSend} style={{ display: 'flex', padding: '15px 15px 25px 15px', gap: '10px', background: 'transparent', alignItems: 'center' }}>
          
          {/* Main Input Container */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#1c1c1e', borderRadius: '25px', padding: '8px 15px', gap: '12px' }}>
            
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ background: 'transparent', border: 'none', color: showEmojiPicker ? 'var(--primary)' : '#888', display: 'flex', cursor: 'pointer', padding: 0 }}>
              <Smile size={24} />
            </button>
          
          <input 
            type="text" 
            value={text}
            onChange={handleTyping}
            placeholder="Message"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: 'white', fontSize: '1rem', padding: '5px 0' }}
          />

          <input 
            type="file" 
            id="image-upload" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedImage(e.target.files[0]);
              }
            }}
          />
          <button type="button" onClick={() => document.getElementById('image-upload').click()} style={{ background: 'transparent', border: 'none', color: '#888', display: 'flex', cursor: 'pointer', padding: 0 }}>
            <Camera size={24} />
          </button>

        </div>

        {/* Send Button */}
        <button type="submit" disabled={!text.trim() && !selectedImage} style={{ background: 'linear-gradient(135deg, #ff4b82, #ff8c4b)', color: 'white', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, opacity: (!text.trim() && !selectedImage) ? 0.6 : 1 }}>
          <Send size={20} style={{ transform: 'translateY(1px)' }} />
        </button>
      </form>
      </div>

      <ConfirmActionModal 
        isOpen={showUnmatchConfirm}
        onClose={() => setShowUnmatchConfirm(false)}
        onConfirm={handleUnmatch}
        title={`Unmatch ${otherUser?.first_name}?`}
        message="You will be removed from each other's match list and you won't be able to message them again."
        confirmText="Unmatch"
        isLoading={isProcessing}
      />

      <ConfirmActionModal 
        isOpen={showBlockConfirm}
        onClose={() => setShowBlockConfirm(false)}
        onConfirm={handleBlock}
        title={`Block ${otherUser?.first_name}?`}
        message="They won't be able to find your profile, see your posts, or message you. This action is irreversible."
        confirmText="Block"
        isLoading={isProcessing}
      />

      <ReportUserModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onReport={handleReport}
        targetName={otherUser?.first_name}
        isLoading={isProcessing}
      />
      </div>
    </div>
  );
};

export default Chat;
