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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!videoFile || !thumbnailFile) {
      setError('Please select both video and thumbnail files');
      return;
    }

    if (formData.genre.length === 0) {
      setError('Please select at least one genre');
      return;
    }

    setUploading(true);

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
      
      if (response.success) {
        alert('Video uploaded successfully!');
        navigate('/admin/videos');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-white text-4xl font-bold mb-8">Upload New Video</h1>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">Video File *</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required
                className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Thumbnail *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                required
                className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2">Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
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
                className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Genre * (Select at least one)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {genres.map((genre) => (
                <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.genre.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="form-checkbox h-5 w-5 text-red-600"
                  />
                  <span className="text-white">{genre}</span>
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
              className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {ratings.map((rating) => (
                <option key={rating} value={rating}>{rating}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Cast (comma-separated)</label>
            <input
              type="text"
              name="cast"
              value={formData.cast}
              onChange={handleChange}
              placeholder="Actor 1, Actor 2, Actor 3"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Director</label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
