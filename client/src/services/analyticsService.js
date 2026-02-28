import api from './api';

export const analyticsService = {
  trackEvent: async (videoId, action, data = {}) => {
    const response = await api.post('/analytics/track', {
      videoId,
      action,
      ...data
    });
    return response.data;
  },

  updateProgress: async (videoId, progress) => {
    const response = await api.post('/analytics/progress', {
      videoId,
      progress
    });
    return response.data;
  },

  getUserAnalytics: async () => {
    const response = await api.get('/analytics/user');
    return response.data;
  }
};
