import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import VideoCard from '../components/VideoCard';
import Loading from '../components/Loading';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await userService.getWatchHistory();
      if (response.success) {
        setHistory(response.data.history);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
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
        <h1 className="text-white text-4xl font-bold mb-8">Watch History</h1>

        {history.length === 0 ? (
          <div className="text-center text-gray-400 text-xl py-16">
            You haven't watched any content yet.
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-gray-900 rounded-lg p-4 flex items-center space-x-4"
              >
                <div className="w-48 flex-shrink-0">
                  <VideoCard video={item.videoId} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-xl font-semibold mb-2">
                    {item.videoId?.title}
                  </h3>
                  <div className="text-gray-400 text-sm mb-2">
                    Watched on {new Date(item.watchedAt).toLocaleDateString()}
                  </div>
                  <div className="relative h-2 bg-gray-700 rounded overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-red-600 transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    {item.completed ? 'Completed' : `${Math.round(item.progress)}% watched`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
