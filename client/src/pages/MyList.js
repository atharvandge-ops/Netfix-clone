import React, { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import VideoCard from '../components/VideoCard';
import Loading from '../components/Loading';

const MyList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await userService.getFavorites();
      if (response.success) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (videoId) => {
    try {
      await userService.removeFromFavorites(videoId);
      setFavorites(favorites.filter(v => v._id !== videoId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-white text-4xl font-bold mb-8">My List</h1>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-400 text-xl py-16">
            You haven't added any titles to your list yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                showRemove={true}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
