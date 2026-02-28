import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  getWatchHistory: async (params = {}) => {
    const response = await api.get('/user/history', { params });
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get('/user/favorites');
    return response.data;
  },

  addToFavorites: async (videoId) => {
    const response = await api.post(`/user/favorites/${videoId}`);
    return response.data;
  },

  removeFromFavorites: async (videoId) => {
    const response = await api.delete(`/user/favorites/${videoId}`);
    return response.data;
  }
};
