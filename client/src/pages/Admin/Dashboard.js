import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Loading from '../../components/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-white text-4xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
            <p className="text-white text-3xl font-bold">
              {stats?.stats?.totalUsers || 0}
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Active Subscribers</h3>
            <p className="text-white text-3xl font-bold">
              {stats?.stats?.activeSubscribers || 0}
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Videos</h3>
            <p className="text-white text-3xl font-bold">
              {stats?.stats?.totalVideos || 0}
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Views</h3>
            <p className="text-white text-3xl font-bold">
              {stats?.stats?.totalViews || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-white text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/admin/upload"
                className="block w-full py-3 bg-red-600 text-white text-center font-semibold rounded hover:bg-red-700 transition"
              >
                Upload New Video
              </Link>
              <Link
                to="/admin/videos"
                className="block w-full py-3 bg-gray-700 text-white text-center font-semibold rounded hover:bg-gray-600 transition"
              >
                Manage Videos
              </Link>
              <Link
                to="/admin/users"
                className="block w-full py-3 bg-gray-700 text-white text-center font-semibold rounded hover:bg-gray-600 transition"
              >
                Manage Users
              </Link>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-white text-2xl font-bold mb-4">Popular Videos</h2>
            <div className="space-y-3">
              {stats?.popularVideos?.slice(0, 5).map((video) => (
                <div key={video._id} className="flex items-center space-x-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold truncate">
                      {video.title}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {video.views} views • {video.likes} likes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-white text-2xl font-bold mb-4">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-gray-400 py-3">Name</th>
                  <th className="text-left text-gray-400 py-3">Email</th>
                  <th className="text-left text-gray-400 py-3">Status</th>
                  <th className="text-left text-gray-400 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentUsers?.map((user) => (
                  <tr key={user._id} className="border-b border-gray-800">
                    <td className="text-white py-3">{user.name}</td>
                    <td className="text-gray-400 py-3">{user.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.subscriptionStatus === 'active'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {user.subscriptionStatus}
                      </span>
                    </td>
                    <td className="text-gray-400 py-3">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
