import api from './api';

export const searchService = {
  searchVideos: async (params) => {
    const response = await api.get('/search', { params });
    return response.data;
  },

  getSuggestions: async (query) => {
    const response = await api.get('/search/suggestions', {
      params: { q: query }
    });
    return response.data;
  },

  getFilterOptions: async () => {
    const response = await api.get('/search/filters');
    return response.data;
  }
};
