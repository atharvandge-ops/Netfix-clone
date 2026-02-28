const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  genre: [{
    type: String,
    enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Sci-Fi', 'Documentary', 'Animation', 'Adventure', 'Crime', 'Fantasy', 'Mystery', 'Family']
  }],
  category: {
    type: String,
    enum: ['Movie', 'TV Show', 'Documentary', 'Series'],
    required: true
  },
  releaseYear: {
    type: Number,
    min: [1900, 'Invalid release year'],
    max: [new Date().getFullYear() + 1, 'Invalid release year']
  },
  rating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'],
    default: 'PG-13'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  cast: [{
    type: String
  }],
  director: {
    type: String
  },
  trailerUrl: {
    type: String
  }
}, {
  timestamps: true
});

videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({ genre: 1, category: 1 });
videoSchema.index({ views: -1 });
videoSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Video', videoSchema);
