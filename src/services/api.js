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
  uploadPhotos: (formData) => api.post('/users/upload-photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const AuthService = {
  checkEmail: (email) => api.post('/auth/check-email', { email }),
  checkMobile: (mobile) => api.post('/auth/check-mobile', { mobile }),
  signup: (data) => api.post('/auth/signup', data),
};

export const MatchingService = {
  getPotentialMatches: () => api.get('/matching/potential-matches'),
  searchUsers: (filters) => api.post('/matching/search', filters),
  likeUser: (targetUid) => api.post('/matching/like', { targetUid }),
  skipUser: (targetUid) => api.post('/matching/skip', { targetUid }),
  saveView: (targetUid) => api.post('/matching/view', { targetUid }),
  updateLocation: (latitude, longitude) => api.post('/matching/nearby/location', { latitude, longitude }),
  getNearbyMatches: (filters) => {
    let url = '/matching/nearby?';
    if (filters?.limit) url += `limit=${filters.limit}&`;
    if (filters?.page) url += `page=${filters.page}&`;
    if (filters?.radius) url += `radius=${filters.radius}&`;
    if (filters?.ageMin) url += `ageMin=${filters.ageMin}&`;
    if (filters?.ageMax) url += `ageMax=${filters.ageMax}&`;
    return api.get(url);
  },
  getReceivedLikes: () => api.get('/matching/received-likes'),
  getReceivedViews: () => api.get('/matching/received-views'),
  getMatches: () => api.get('/matching/matches'),
  getRelationshipIds: () => api.get('/matching/relationship-ids'),
  reportUser: (data) => api.post('/matching/report', data),
  blockUser: (targetUid) => api.post('/matching/block', { targetUid }),
  unmatchUser: (targetUid) => api.delete(`/matching/matches/${targetUid}`),
};

export const ChatService = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (chatId, before = '') => api.get(`/chat/messages/${chatId}${before ? `?before=${before}` : ''}`),
  sendMessage: (data) => api.post('/chat/messages', data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  markAsRead: (chatId) => api.patch(`/chat/messages/${chatId}/read`),
  deleteMessage: (messageId) => api.delete(`/chat/messages/${messageId}`),
};export const PromotionsService = {
  getActive: () => api.get('/promotions/active'),
  markViewed: (id) => api.patch(`/promotions/event-cards/${id}/view`),
};
