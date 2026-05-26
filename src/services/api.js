import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Adjust base URL as needed
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to add Firebase Auth token to requests
api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
export default api;

export const UserService = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.patch('/users/updateMe', data),
  getUserById: (uid) => api.get(`/users/${uid}`),
};

export const MatchingService = {
  getPotentialMatches: () => api.get('/matching/potential-matches'),
  searchUsers: (filters) => api.post('/matching/search', filters),
  likeUser: (targetUid) => api.post('/matching/like', { targetUid }),
  skipUser: (targetUid) => api.post('/matching/skip', { targetUid }),
  saveView: (targetUid) => api.post('/matching/view', { targetUid }),
  getReceivedLikes: () => api.get('/matching/received-likes'),
  getReceivedViews: () => api.get('/matching/received-views'),
  getMatches: () => api.get('/matching/matches'),
  getRelationshipIds: () => api.get('/matching/relationship-ids'),
};

export const ChatService = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (chatId, before = '') => api.get(`/chat/messages/${chatId}${before ? `?before=${before}` : ''}`),
  sendMessage: (data) => api.post('/chat/messages', data), // expects FormData if media, or JSON { chatId, text, receiverId }
  markAsRead: (chatId) => api.patch(`/chat/messages/${chatId}/read`),
};

