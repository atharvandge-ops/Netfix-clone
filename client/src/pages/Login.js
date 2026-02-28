import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.success) {
        navigate('/browse');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-cover bg-center opacity-30"
           style={{
             backgroundImage: "url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920')"
           }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black bg-opacity-75 rounded-lg p-8">
          <h2 className="text-white text-3xl font-bold mb-8">Sign In</h2>

          {error && (
            <div className="bg-red-600 text-white p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              New to StreamFlix?{' '}
              <Link to="/register" className="text-white hover:underline">
                Sign up now
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/pricing" className="text-sm text-gray-400 hover:text-white">
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
