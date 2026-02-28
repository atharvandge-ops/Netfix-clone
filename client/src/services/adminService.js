import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, { isActive });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllVideosAdmin: async (params = {}) => {
    const response = await api.get('/admin/videos', { params });
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await api.post('/admin/plans', planData);
    return response.data;
  },

  updatePlan: async (planId, planData) => {
    const response = await api.put(`/admin/plans/${planId}`, planData);
    return response.data;
  }
};
