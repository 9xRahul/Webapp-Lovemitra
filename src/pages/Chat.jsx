import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChatService, UserService } from '../services/api';
import { getSocket, initiateSocketConnection } from '../services/socket';
import { auth } from '../firebase';
import { ArrowLeft, Send, Smile, Camera, X, CheckCheck, Check, Heart, MessageSquare } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

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

  const COMMON_EMOJIS = ['😀','😂','🥰','😎','😭','🥺','😍','🔥','❤️','✨','👍','🎉','😊','🙏','🙌','🤔','😅','👀','😘','💯','💀','💕','😌','😩'];
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
                if (prev.some(m => m.content === payload.message.content && Date.now() - new Date(m.createdAt).getTime() < 5000)) {
                  return prev.map(m => m.content === payload.message.content ? payload.message : m);
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
      const payload = { chatId, content: text, receiverId: otherUser?.uid, type: 'text' };
      // Optimistic UI
      const tempMsg = { _id: Date.now().toString(), senderId: auth.currentUser?.uid || 'me', content: text, type: 'text', createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, tempMsg]);
      setText('');
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

  return (
    <div style={{ flex: 1, maxWidth: '400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        
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
        </div>

      {/* Messages Area */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
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
                {msg.type === 'image' || (msg.content && msg.content.startsWith('http')) ? (
                  <img src={msg.content} alt="Attachment" style={{ width: '100%', borderRadius: '10px' }} />
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
          <div style={{ 
            position: 'absolute', 
            bottom: '100%', 
            left: '15px', 
            background: '#1c1c1e', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '15px', 
            padding: '10px', 
            marginBottom: '10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '8px',
            boxShadow: '0 -5px 20px rgba(0,0,0,0.5)',
            zIndex: 100
          }}>
            {COMMON_EMOJIS.map(emoji => (
              <button 
                key={emoji} 
                type="button"
                onClick={() => {
                  setText(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '5px' }}
              >
                {emoji}
              </button>
            ))}
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
    </div>
  );
};

export default Chat;
