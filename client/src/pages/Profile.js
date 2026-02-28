import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { subscriptionService } from '../services/subscriptionService';
import Loading from '../components/Loading';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email
      });
    }
    fetchSubscriptionStatus();
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await subscriptionService.getSubscriptionStatus();
      if (response.success) {
        setSubscription(response.data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await userService.updateProfile(formData);
      if (response.success) {
        updateUser(response.data.user);
        setMessage('Profile updated successfully');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        const response = await subscriptionService.cancelSubscription();
        if (response.success) {
          setMessage('Subscription will be cancelled at the end of billing period');
          fetchSubscriptionStatus();
        }
      } catch (error) {
        setMessage('Error cancelling subscription');
      }
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-white text-4xl font-bold mb-8">Account Settings</h1>

        {message && (
          <div className={`p-4 rounded mb-6 ${
            message.includes('Error') ? 'bg-red-600' : 'bg-green-600'
          } text-white`}>
            {message}
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-8 mb-8">
          <h2 className="text-white text-2xl font-bold mb-6">Profile Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:bg-gray-600"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-white text-2xl font-bold mb-6">Subscription Details</h2>
          
          {subscription ? (
            <div className="space-y-4">
              <div>
                <span className="text-gray-400">Plan: </span>
                <span className="text-white font-semibold">
                  {subscription.plan?.name || 'No active plan'}
                </span>
              </div>

              <div>
                <span className="text-gray-400">Status: </span>
                <span className={`font-semibold ${
                  subscription.subscriptionStatus === 'active'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}>
                  {subscription.subscriptionStatus}
                </span>
              </div>

              {subscription.expiry && (
                <div>
                  <span className="text-gray-400">Expires: </span>
                  <span className="text-white">
                    {new Date(subscription.expiry).toLocaleDateString()}
                  </span>
                </div>
              )}

              {subscription.hasActiveSubscription && (
                <button
                  onClick={handleCancelSubscription}
                  className="mt-4 px-6 py-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No subscription information available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
