import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoById, clearCurrentVideo } from '../store/slices/videoSlice';
import VideoPlayer from '../components/VideoPlayer';
import VideoRow from '../components/VideoRow';
import Loading from '../components/Loading';
import { videoService } from '../services/videoService';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentVideo, loading, videos } = useSelector((state) => state.videos);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchVideoById(id));
      videoService.incrementViews(id).catch(err => console.error('Error incrementing views:', err));
    }

    return () => {
      dispatch(clearCurrentVideo());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentVideo && videos.length > 0) {
      const related = videos.filter(v => 
        v._id !== currentVideo._id &&
        v.genre?.some(g => currentVideo.genre?.includes(g))
      ).slice(0, 10);
      setRelatedVideos(related);
    }
  }, [currentVideo, videos]);

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Video not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 left-4 z-50 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition"
      >
        ← Back
      </button>

      <VideoPlayer
        videoId={currentVideo._id}
        videoUrl={currentVideo.videoUrl}
        onEnded={() => console.log('Video ended')}
      />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-white text-4xl font-bold mb-4">
          {currentVideo.title}
        </h1>

        <div className="flex items-center space-x-4 text-gray-300 mb-6">
          <span className="text-green-500 font-semibold">
            {currentVideo.views} views
          </span>
          <span>•</span>
          <span>{currentVideo.releaseYear}</span>
          <span>•</span>
          <span>{currentVideo.duration} min</span>
          <span>•</span>
          <span className="px-2 py-1 border border-gray-500 text-sm">
            {currentVideo.rating}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {currentVideo.genre?.map((genre, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>

        <p className="text-gray-300 text-lg mb-8 max-w-4xl">
          {currentVideo.description}
        </p>

        {currentVideo.cast && currentVideo.cast.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-xl font-semibold mb-2">Cast</h3>
            <p className="text-gray-300">{currentVideo.cast.join(', ')}</p>
          </div>
        )}

        {currentVideo.director && (
          <div className="mb-6">
            <h3 className="text-white text-xl font-semibold mb-2">Director</h3>
            <p className="text-gray-300">{currentVideo.director}</p>
          </div>
        )}
      </div>

      {relatedVideos.length > 0 && (
        <div className="pb-16">
          <VideoRow title="More Like This" videos={relatedVideos} />
        </div>
      )}
    </div>
  );
};

export default Watch;
