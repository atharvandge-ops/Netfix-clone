import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ selectedPlan, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      const response = await subscriptionService.createSubscription(
        selectedPlan._id,
        paymentMethod.id
      );

      if (response.success) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded mb-4">
        <CardElement
          options={{
            style: {
              base: {
                color: '#fff',
                fontSize: '16px',
                '::placeholder': {
                  color: '#aab7c4'
                }
              }
            }
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Subscribe - $${selectedPlan.price}/month`}
      </button>
    </form>
  );
};

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
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

  const handlePaymentSuccess = () => {
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
              <p className="text-white mb-2">Selected Plan: {selectedPlan.name}</p>
              <p className="text-gray-400 mb-2">
                ${selectedPlan.price}/month
              </p>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                selectedPlan={selectedPlan}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>

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
