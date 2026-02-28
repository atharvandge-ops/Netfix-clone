import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Loading from '../../components/Loading';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [search, statusFilter]);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (search) {
        params.search = search;
      }

      const response = await adminService.getAllUsers(params);
      if (response.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await adminService.updateUserStatus(userId, !currentStatus);
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isActive: !currentStatus } : u
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
      }
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-white text-4xl font-bold mb-8">Manage Users</h1>

        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="all">All Status</option>
            <option value="active">Active Subscription</option>
            <option value="inactive">Inactive</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left text-gray-300 py-4 px-4">Name</th>
                <th className="text-left text-gray-300 py-4 px-4">Email</th>
                <th className="text-left text-gray-300 py-4 px-4">Subscription</th>
                <th className="text-left text-gray-300 py-4 px-4">Plan</th>
                <th className="text-left text-gray-300 py-4 px-4">Joined</th>
                <th className="text-left text-gray-300 py-4 px-4">Status</th>
                <th className="text-left text-gray-300 py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-800">
                  <td className="text-white py-4 px-4">{user.name}</td>
                  <td className="text-gray-400 py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.subscriptionStatus === 'active'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {user.subscriptionStatus}
                    </span>
                  </td>
                  <td className="text-gray-400 py-4 px-4">
                    {user.subscriptionPlan?.name || 'None'}
                  </td>
                  <td className="text-gray-400 py-4 px-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.isActive)}
                        className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition"
                      >
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
