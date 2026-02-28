import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import PlanCard from '../components/PlanCard';
import Loading from '../components/Loading';

const CardDetailsForm = ({ onSubmit, loading }) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardDetails({
        ...cardDetails,
        cardNumber: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(cardDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardDetails.cardholderName}
          onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
          placeholder="John Doe"
          required
          className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
        />
      </div>

      <div>
        <label className="block text-white text-sm font-semibold mb-2">
          Card Number
        </label>
        <input
          type="text"
          value={formatCardNumber(cardDetails.cardNumber)}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          required
          maxLength={19}
          className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 tracking-wider"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Month
          </label>
          <input
            type="text"
            value={cardDetails.expiryMonth}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 2 && /^\d*$/.test(value)) {
                setCardDetails({ ...cardDetails, expiryMonth: value });
              }
            }}
            placeholder="MM"
            required
            maxLength={2}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            Year
          </label>
          <input
            type="text"
            value={cardDetails.expiryYear}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 2 && /^\d*$/.test(value)) {
                setCardDetails({ ...cardDetails, expiryYear: value });
              }
            }}
            placeholder="YY"
            required
            maxLength={2}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">
            CVV
          </label>
          <input
            type="text"
            value={cardDetails.cvv}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 3 && /^\d*$/.test(value)) {
                setCardDetails({ ...cardDetails, cvv: value });
              }
            }}
            placeholder="123"
            required
            maxLength={3}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
      </div>

      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-3 rounded">
        <p className="text-blue-300 text-xs">
          💡 <strong>Demo Mode:</strong> Enter any card details - no validation required
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Continue to OTP Verification'}
      </button>
    </form>
  );
};

const OTPVerification = ({ onVerify, loading, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setError('');
    onVerify(otpValue);
  };

  return (
    <div className="mt-6">
      <div className="bg-gray-800 p-6 rounded-lg mb-6 text-center">
        <div className="text-4xl mb-4">📱</div>
        <h3 className="text-white text-xl font-bold mb-2">
          Enter OTP
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          We've sent a verification code to your registered mobile number
        </p>
        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-2 rounded">
          <p className="text-blue-300 text-xs">
            💡 <strong>Demo Mode:</strong> Enter any 6-digit OTP
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center space-x-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              className="w-12 h-14 text-center text-2xl font-bold bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify & Subscribe'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full mt-3 py-2 text-gray-400 hover:text-white transition text-sm"
        >
          ← Back to Card Details
        </button>
      </form>

      <div className="mt-4 text-center">
        <button className="text-blue-400 hover:text-blue-300 text-sm">
          Resend OTP
        </button>
      </div>
    </div>
  );
};

const SuccessMessage = ({ selectedPlan, onContinue }) => {
  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <div className="inline-block w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-white text-3xl font-bold mb-4">
        Subscription Successful! 🎉
      </h2>
      
      <p className="text-gray-300 text-lg mb-2">
        Welcome to StreamFlix {selectedPlan.name}!
      </p>
      
      <div className="bg-gray-800 rounded-lg p-6 my-6 max-w-md mx-auto">
        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="text-gray-400">Plan:</span>
            <span className="text-white font-semibold">{selectedPlan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Price:</span>
            <span className="text-white font-semibold">${selectedPlan.price}/month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Video Quality:</span>
            <span className="text-white font-semibold">{selectedPlan.videoQuality}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Screens:</span>
            <span className="text-white font-semibold">{selectedPlan.simultaneousScreens}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-400 mb-6">
        You can now access unlimited content and enjoy streaming!
      </p>

      <button
        onClick={onContinue}
        className="px-8 py-3 bg-red-600 text-white text-lg font-semibold rounded hover:bg-red-700 transition"
      >
        Start Watching
      </button>
    </div>
  );
};

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState('plans');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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
    setStep('card-details');
  };

  const handleCardSubmit = async (cardDetails) => {
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpVerify = async (otp) => {
    setProcessing(true);

    setTimeout(async () => {
      try {
        const response = await subscriptionService.createSubscription(selectedPlan._id, 'demo');
        
        if (response.success) {
          setProcessing(false);
          setStep('success');
        } else {
          setProcessing(false);
          alert('Subscription failed. Please try again.');
        }
      } catch (err) {
        setProcessing(false);
        alert('Subscription failed. Please try again.');
        console.error('Subscription error:', err);
      }
    }, 2000);
  };

  const handleContinueToApp = async () => {
    await checkAuth();
    navigate('/browse');
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4">
      <div className="container mx-auto">
        {step === 'plans' && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-white text-5xl font-bold mb-4">
                Choose the plan that's right for you
              </h1>
              <p className="text-gray-300 text-xl">
                Join today and enjoy unlimited streaming
              </p>
              <div className="mt-4 inline-block bg-blue-900 bg-opacity-50 border border-blue-500 px-6 py-3 rounded">
                <p className="text-blue-200 text-sm">
                  🎭 <strong>Demo Mode:</strong> Enter any card details and OTP for testing
                </p>
              </div>
            </div>

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
          </>
        )}

        {step === 'card-details' && (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900 rounded-lg p-8">
              <h2 className="text-white text-2xl font-bold mb-2">
                Payment Details
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Selected Plan: <span className="text-white font-semibold">{selectedPlan.name}</span> - ${selectedPlan.price}/month
              </p>

              <CardDetailsForm
                onSubmit={handleCardSubmit}
                loading={processing}
              />

              <button
                onClick={() => setStep('plans')}
                className="w-full mt-4 py-2 text-gray-400 hover:text-white transition"
              >
                ← Back to Plans
              </button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900 rounded-lg p-8">
              <OTPVerification
                onVerify={handleOtpVerify}
                loading={processing}
                onBack={() => setStep('card-details')}
              />
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-8">
              <SuccessMessage
                selectedPlan={selectedPlan}
                onContinue={handleContinueToApp}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
