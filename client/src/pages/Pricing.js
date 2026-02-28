import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';

const DemoCheckoutForm = ({ selectedPlan, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoSubscribe = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await subscriptionService.createSubscription(selectedPlan._id, 'demo');
      
      if (response.success) {
        onSuccess();
      } else {
        setError(response.message || 'Subscription failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-blue-900 bg-opacity-50 border border-blue-500 p-4 rounded mb-4">
        <p className="text-blue-200 text-sm mb-2">
          🎭 <strong>Demo Mode Active</strong>
        </p>
        <p className="text-blue-300 text-sm">
          No payment required. Click subscribe to activate your account instantly for testing.
        </p>
      </div>

      <button
        type="button"
        onClick={handleDemoSubscribe}
        disabled={loading}
        className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {loading ? 'Activating...' : 'Activate Subscription (Demo)'}
      </button>
    </div>
  );
};

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);
  const { user, isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await subscriptionService.getPlans();
      if (response.success) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = async () => {
    await checkAuth();
    navigate('/browse');
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-white text-5xl font-bold mb-4">
            Choose the plan that's right for you
          </h1>
          <p className="text-gray-300 text-xl">
            Join today and enjoy unlimited streaming
          </p>
          {demoMode && (
            <div className="mt-4 inline-block bg-blue-900 bg-opacity-50 border border-blue-500 px-6 py-3 rounded">
              <p className="text-blue-200 text-sm">
                🎭 <strong>Demo Mode:</strong> No payment required for testing
              </p>
            </div>
          )}
        </div>

        {!showCheckout ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onSelect={handleSelectPlan}
                isSelected={selectedPlan?._id === plan._id}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-gray-900 rounded-lg p-8">
            <h2 className="text-white text-2xl font-bold mb-4">
              Complete Your Subscription
            </h2>
            <div className="mb-6">
              <p className="text-white mb-2">Selected Plan: <span className="font-bold">{selectedPlan.name}</span></p>
              <p className="text-gray-400 mb-2">
                ${selectedPlan.price}/month
              </p>
              <div className="mt-4 space-y-2">
                {selectedPlan.features?.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-300 text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <DemoCheckoutForm
              selectedPlan={selectedPlan}
              onSuccess={handlePaymentSuccess}
            />

            <button
              onClick={() => setShowCheckout(false)}
              className="w-full mt-4 py-2 text-gray-400 hover:text-white transition"
            >
              ← Back to Plans
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
