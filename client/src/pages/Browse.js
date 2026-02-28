import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '../store/slices/videoSlice';
import VideoRow from '../components/VideoRow';
import Loading from '../components/Loading';

const Browse = () => {
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.videos);
  const [groupedVideos, setGroupedVideos] = useState({});
  const [featuredVideo, setFeaturedVideo] = useState(null);

  useEffect(() => {
    dispatch(fetchVideos({ limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (videos.length > 0) {
      setFeaturedVideo(videos[0]);
      
      const grouped = videos.reduce((acc, video) => {
        video.genre?.forEach((genre) => {
          if (!acc[genre]) {
            acc[genre] = [];
          }
          acc[genre].push(video);
        });
        return acc;
      }, {});

      grouped['Popular'] = [...videos].sort((a, b) => b.views - a.views);
      grouped['Recently Added'] = [...videos].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setGroupedVideos(grouped);
    }
  }, [videos]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      {featuredVideo && (
        <div className="relative h-screen">
          <div className="absolute inset-0">
            <img
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-white text-5xl md:text-7xl font-bold mb-4">
                {featuredVideo.title}
              </h1>
              <p className="text-white text-lg mb-6 line-clamp-3">
                {featuredVideo.description}
              </p>
              <div className="flex items-center space-x-4 text-white mb-8">
                <span className="px-2 py-1 border border-white text-sm">
                  {featuredVideo.rating}
                </span>
                <span>{featuredVideo.releaseYear}</span>
                <span>{featuredVideo.duration} min</span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => window.location.href = `/watch/${featuredVideo._id}`}
                  className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-300 transition flex items-center"
                >
                  <span className="mr-2">▶</span> Play
                </button>
                <button className="px-8 py-3 bg-gray-600 bg-opacity-70 text-white font-bold rounded hover:bg-opacity-50 transition">
                  More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 -mt-32 pb-16">
        {Object.entries(groupedVideos).map(([category, categoryVideos]) => (
          categoryVideos.length > 0 && (
            <VideoRow
              key={category}
              title={category}
              videos={categoryVideos}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Browse;
