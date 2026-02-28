import api from './api';

export const videoService = {
  getAllVideos: async (params = {}) => {
    const response = await api.get('/videos', { params });
    return response.data;
  },

  getVideoById: async (id) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  incrementViews: async (id) => {
    const response = await api.post(`/videos/${id}/view`);
    return response.data;
  },

  toggleLike: async (id, like) => {
    const response = await api.post(`/videos/${id}/like`, { like });
    return response.data;
  },

  uploadVideo: async (formData) => {
    const response = await api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateVideo: async (id, data) => {
    const response = await api.put(`/videos/${id}`, data);
    return response.data;
  },

  deleteVideo: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  }
};
