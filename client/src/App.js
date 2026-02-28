import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './contexts/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import Watch from './pages/Watch';
import Pricing from './pages/Pricing';
import SearchResults from './pages/SearchResults';
import MyList from './pages/MyList';
import History from './pages/History';
import Profile from './pages/Profile';

import AdminDashboard from './pages/Admin/Dashboard';
import UploadVideo from './pages/Admin/UploadVideo';
import ManageVideos from './pages/Admin/ManageVideos';
import ManageUsers from './pages/Admin/ManageUsers';

import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-black">
              <Navbar />
              <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />

              <Route
                path="/browse"
                element={
                  <ProtectedRoute requireSubscription={true}>
                    <Browse />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/watch/:id"
                element={
                  <ProtectedRoute requireSubscription={true}>
                    <Watch />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/search"
                element={
                  <ProtectedRoute requireSubscription={true}>
                    <SearchResults />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-list"
                element={
                  <ProtectedRoute requireSubscription={true}>
                    <MyList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute requireSubscription={true}>
                    <History />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/upload"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <UploadVideo />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/videos"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <ManageVideos />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              </Routes>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
