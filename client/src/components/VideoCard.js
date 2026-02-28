import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';

const VideoCard = ({ video, showRemove = false, onRemove }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePlay = () => {
    navigate(`/watch/${video._id}`);
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      if (isFavorite) {
        await userService.removeFromFavorites(video._id);
      } else {
        await userService.addToFavorites(video._id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(video._id);
    }
  };

  return (
    <div
      className="relative group cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
    >
      <div className="relative overflow-hidden rounded-md">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-4 transition-opacity">
            <h3 className="text-white font-bold text-lg mb-1">{video.title}</h3>
            
            <div className="flex items-center space-x-2 text-sm text-gray-300 mb-2">
              <span>{video.duration} min</span>
              <span>•</span>
              <span>{video.releaseYear}</span>
              <span>•</span>
              <span>{video.rating}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {video.genre?.slice(0, 3).map((g, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-xs text-white rounded"
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlay}
                className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-semibold"
              >
                ▶ Play
              </button>
              
              {showRemove ? (
                <button
                  onClick={handleRemove}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                >
                  ✕
                </button>
              ) : (
                <button
                  onClick={handleToggleFavorite}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition text-sm"
                >
                  {isFavorite ? '✓' : '+'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {!isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
          <h3 className="text-white font-semibold truncate">{video.title}</h3>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
