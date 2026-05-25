import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ChatService } from '../services/api';
import { getSocket } from '../services/socket';
import { ArrowLeft, Send } from 'lucide-react';

const Chat = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { otherUser } = location.state || {};
  
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    const socket = getSocket();
    if (socket) {
      socket.on('receive_message', (newMessage) => {
        if (newMessage.chatId === chatId) {
          setMessages(prev => [...prev, newMessage]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
      }
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await ChatService.getMessages(chatId);
      if (res.data.status === 'success') {
        setMessages(res.data.data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const payload = { chatId, text, receiverId: otherUser?.uid };
      // Optimistic UI
      const tempMsg = { _id: Date.now().toString(), senderId: 'me', text, createdAt: new Date().toISOString() };
      setMessages(prev => [...prev, tempMsg]);
      setText('');

      await ChatService.sendMessage(payload);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="layout-container" style={{ background: 'var(--bg-light)' }}>
      {/* Chat Header */}
      <div className="app-header" style={{ borderBottom: '1px solid var(--glass-border)', padding: '1rem' }}>
        <button className="icon-btn" onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
          {otherUser?.first_name || 'Match'}
        </div>
        <div style={{ width: 24 }}></div> {/* Spacer */}
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me' || (otherUser && msg.senderId !== otherUser.uid);
          return (
            <div key={msg._id} style={{ 
              alignSelf: isMe ? 'flex-end' : 'flex-start',
              background: isMe ? 'var(--primary)' : 'var(--glass-bg)',
              color: isMe ? 'white' : 'inherit',
              padding: '10px 15px',
              borderRadius: '20px',
              maxWidth: '75%',
              wordBreak: 'break-word',
              border: isMe ? 'none' : '1px solid var(--glass-border)'
            }}>
              {msg.text}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '10px', gap: '10px', borderTop: '1px solid var(--glass-border)' }}>
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--glass-border)', outline: 'none', background: 'var(--glass-bg)', color: 'inherit' }}
        />
        <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
