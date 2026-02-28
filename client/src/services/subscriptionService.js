import api from './api';

export const subscriptionService = {
  getPlans: async () => {
    const response = await api.get('/subscription/plans');
    return response.data;
  },

  createSubscription: async (planId, paymentMethodId) => {
    const response = await api.post('/subscription/create', {
      planId,
      paymentMethodId
    });
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await api.post('/subscription/cancel');
    return response.data;
  },

  getSubscriptionStatus: async () => {
    const response = await api.get('/subscription/status');
    return response.data;
  }
};
