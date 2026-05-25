import { io } from 'socket.io-client';

let socket;

export const initiateSocketConnection = (uid) => {
  // Use baseUrl without /api for socket connection
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
    : 'http://localhost:5000';

  if (socket && socket.connected) return;

  socket = io(baseUrl, {
    query: { uid },
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('Connected to real-time server');
    socket.emit('status', { isOnline: true });
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from real-time server');
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.emit('status', { isOnline: false });
    socket.disconnect();
  }
};

export const getSocket = () => socket;
