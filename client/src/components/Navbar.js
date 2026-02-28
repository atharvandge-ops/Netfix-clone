import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-black bg-opacity-90 fixed w-full z-50 top-0">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-red-600 text-2xl font-bold">
            STREAMFLIX
          </Link>
          
          {isAuthenticated && (
            <div className="hidden md:flex space-x-6">
              <Link to="/browse" className="text-white hover:text-gray-300 transition">
                Home
              </Link>
              <Link to="/my-list" className="text-white hover:text-gray-300 transition">
                My List
              </Link>
              <Link to="/history" className="text-white hover:text-gray-300 transition">
                History
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-red-500 hover:text-red-400 transition">
                  Admin
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated && <SearchBar />}
          
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-white hover:text-gray-300"
              >
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-white hover:bg-gray-800"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-800"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-white hover:text-gray-300 transition"
              >
                Sign In
              </Link>
              <Link
                to="/pricing"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Subscribe
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
