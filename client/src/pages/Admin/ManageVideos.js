import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { videoService } from '../../services/videoService';
import Loading from '../../components/Loading';

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchVideos();
  }, [filter, search]);

  const fetchVideos = async () => {
    try {
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      if (search) {
        params.search = search;
      }

      const response = await adminService.getAllVideosAdmin(params);
      if (response.success) {
        setVideos(response.data.videos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoService.deleteVideo(videoId);
        setVideos(videos.filter(v => v._id !== videoId));
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Error deleting video');
      }
    }
  };

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      await videoService.updateVideo(videoId, { isPublished: !currentStatus });
      setVideos(videos.map(v => 
        v._id === videoId ? { ...v, isPublished: !currentStatus } : v
      ));
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Error updating video');
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-4xl font-bold">Manage Videos</h1>
          <Link
            to="/admin/upload"
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
          >
            Upload New Video
          </Link>
        </div>

        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="flex-1 px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="all">All Videos</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>

        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left text-gray-300 py-4 px-4">Thumbnail</th>
                <th className="text-left text-gray-300 py-4 px-4">Title</th>
                <th className="text-left text-gray-300 py-4 px-4">Category</th>
                <th className="text-left text-gray-300 py-4 px-4">Views</th>
                <th className="text-left text-gray-300 py-4 px-4">Status</th>
                <th className="text-left text-gray-300 py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id} className="border-b border-gray-800">
                  <td className="py-4 px-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="text-white py-4 px-4">{video.title}</td>
                  <td className="text-gray-400 py-4 px-4">{video.category}</td>
                  <td className="text-gray-400 py-4 px-4">{video.views}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      video.isPublished
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {video.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleTogglePublish(video._id, video.isPublished)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                      >
                        {video.isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDelete(video._id)}
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

          {videos.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              No videos found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageVideos;
