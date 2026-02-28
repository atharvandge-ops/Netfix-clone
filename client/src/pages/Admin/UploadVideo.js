import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoService } from '../../services/videoService';

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    genre: [],
    category: 'Movie',
    releaseYear: new Date().getFullYear(),
    rating: 'PG-13',
    cast: '',
    director: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Sci-Fi', 'Documentary', 'Animation', 'Adventure', 'Crime', 'Fantasy', 'Mystery', 'Family'];
  const ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGenreChange = (genre) => {
    const newGenres = formData.genre.includes(genre)
      ? formData.genre.filter(g => g !== genre)
      : [...formData.genre, genre];
    
    setFormData({
      ...formData,
      genre: newGenres
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.floor(video.duration / 60);
        setFormData(prev => ({ ...prev, duration: duration }));
      };
      video.src = URL.createObjectURL(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 95) {
        progress = 95;
        clearInterval(interval);
      }
      setUploadProgress(Math.floor(progress));
    }, 500);
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!videoFile || !thumbnailFile) {
      setError('Please select both video and thumbnail files');
      return;
    }

    if (formData.genre.length === 0) {
      setError('Please select at least one genre');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const progressInterval = simulateProgress();

    try {
      const uploadData = new FormData();
      uploadData.append('video', videoFile);
      uploadData.append('thumbnail', thumbnailFile);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('duration', formData.duration);
      uploadData.append('genre', formData.genre.join(','));
      uploadData.append('category', formData.category);
      uploadData.append('releaseYear', formData.releaseYear);
      uploadData.append('rating', formData.rating);
      uploadData.append('cast', formData.cast);
      uploadData.append('director', formData.director);

      const response = await videoService.uploadVideo(uploadData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.success) {
        setSuccessMessage('Video uploaded successfully! 🎉');
        
        setTimeout(() => {
          navigate('/admin/videos');
        }, 2000);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.response?.data?.message || 'Error uploading video');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleClearVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    document.getElementById('video-input').value = '';
  };

  const handleClearThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    document.getElementById('thumbnail-input').value = '';
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-4xl font-bold">Upload New Video</h1>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-6 flex items-center">
            <span className="text-xl mr-3">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-600 text-white p-4 rounded mb-6 flex items-center">
            <span className="text-xl mr-3">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {uploading && (
          <div className="bg-gray-900 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Uploading...</span>
              <span className="text-white font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Please wait while your video is being uploaded and processed...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">
                Video File * 
                <span className="text-gray-400 text-sm font-normal ml-2">(MP4, MOV, AVI, WebM - Max 500MB)</span>
              </label>
              <div className="space-y-3">
                <input
                  id="video-input"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {videoFile && (
                  <div className="bg-gray-800 p-4 rounded flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">🎬</span>
                      <div>
                        <p className="text-white font-semibold">{videoFile.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearVideo}
                      disabled={uploading}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
                {videoPreview && (
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-64 bg-black rounded"
                  />
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-white font-semibold mb-2">
                Thumbnail Image *
                <span className="text-gray-400 text-sm font-normal ml-2">(JPG, PNG - Recommended 1280x720)</span>
              </label>
              <div className="space-y-3">
                <input
                  id="thumbnail-input"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {thumbnailFile && (
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">🖼️</span>
                        <div>
                          <p className="text-white font-semibold">{thumbnailFile.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(thumbnailFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearThumbnail}
                        disabled={uploading}
                        className="text-red-500 hover:text-red-400 disabled:opacity-50"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    {thumbnailPreview && (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full rounded"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-white text-xl font-bold mb-4">Video Information</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={uploading}
                  placeholder="Enter video title"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={uploading}
                  rows={4}
                  placeholder="Enter a detailed description of the video"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    disabled={uploading}
                    placeholder="120"
                    min="1"
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Auto-detected from video if available
                  </p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                  >
                    <option value="Movie">Movie</option>
                    <option value="TV Show">TV Show</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Series">Series</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Release Year *</label>
                  <input
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    required
                    disabled={uploading}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">
                  Genre * <span className="text-gray-400 text-sm font-normal">(Select at least one)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {genres.map((genre) => (
                    <label
                      key={genre}
                      className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded transition ${
                        formData.genre.includes(genre)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.genre.includes(genre)}
                        onChange={() => handleGenreChange(genre)}
                        disabled={uploading}
                        className="form-checkbox h-4 w-4 text-red-600 rounded"
                      />
                      <span className="text-sm">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Rating *</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                >
                  {ratings.map((rating) => (
                    <option key={rating} value={rating}>{rating}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Cast <span className="text-gray-400 text-sm font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  disabled={uploading}
                  placeholder="Actor 1, Actor 2, Actor 3"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Director</label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  disabled={uploading}
                  placeholder="Director name"
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded mb-6">
              <p className="text-blue-300 text-sm">
                💡 <strong>Demo Mode:</strong> Videos will be uploaded to cloud storage (or use sample URLs in demo mode)
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <span className="mr-2">⬆️</span>
                    Upload Video
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                disabled={uploading}
                className="px-8 py-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h3 className="text-white text-lg font-bold mb-3">📝 Upload Tips</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• <strong>Video Format:</strong> MP4 recommended for best compatibility</li>
            <li>• <strong>Resolution:</strong> 1080p or 720p recommended</li>
            <li>• <strong>File Size:</strong> Keep under 500MB for faster uploads</li>
            <li>• <strong>Thumbnail:</strong> Use 1280x720 aspect ratio (16:9)</li>
            <li>• <strong>Duration:</strong> Will auto-detect from video metadata</li>
            <li>• <strong>Demo Mode:</strong> Sample video URLs used automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
