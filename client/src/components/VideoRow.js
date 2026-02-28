import React, { useRef } from 'react';
import VideoCard from './VideoCard';

const VideoRow = ({ title, videos, showRemove = false, onRemove }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-white text-2xl font-bold mb-4 px-4">{title}</h2>
      
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-r opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
        >
          ‹
        </button>

        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video) => (
            <div key={video._id} className="flex-none w-64">
              <VideoCard
                video={video}
                showRemove={showRemove}
                onRemove={onRemove}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-l opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-75"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default VideoRow;
