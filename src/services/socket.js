import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = (uid) => {
  // Use baseUrl without /api for socket connection
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '').replace('/api', '')
    : 'http://localhost:3000';

  if (socket) {
    if (!socket.connected) {
      socket.connect();
    }
    // If it's already connected, just emit join to be safe
    if (socket.connected) {
      socket.emit('join', uid);
    }
    return;
  }

  socket = io(baseUrl, {
    query: { uid },
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('Connected to real-time server');
    socket.emit('join', uid);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from real-time server');
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
