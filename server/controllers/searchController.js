const Video = require('../models/Video');

const searchVideos = async (req, res) => {
  try {
    const { q, genre, category, releaseYear, rating, page = 1, limit = 20, sort = '-views' } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const query = {
      isPublished: true,
      $text: { $search: q }
    };

    if (genre) {
      query.genre = genre;
    }

    if (category) {
      query.category = category;
    }

    if (releaseYear) {
      query.releaseYear = parseInt(releaseYear);
    }

    if (rating) {
      query.rating = rating;
    }

    const videos = await Video.find(query, { score: { $meta: 'textScore' } })
      .sort(sort === 'relevance' ? { score: { $meta: 'textScore' } } : sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')
      .lean();

    const count = await Video.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        videos,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalResults: count
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching videos',
      error: error.message
    });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const suggestions = await Video.find({
      isPublished: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
    .select('title')
    .limit(10)
    .lean();

    res.status(200).json({
      success: true,
      data: { suggestions: suggestions.map(s => s.title) }
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suggestions',
      error: error.message
    });
  }
};

const getFilterOptions = async (req, res) => {
  try {
    const genres = await Video.distinct('genre', { isPublished: true });
    const categories = await Video.distinct('category', { isPublished: true });
    const years = await Video.distinct('releaseYear', { isPublished: true });
    const ratings = await Video.distinct('rating', { isPublished: true });

    res.status(200).json({
      success: true,
      data: {
        genres: genres.sort(),
        categories: categories.sort(),
        years: years.sort((a, b) => b - a),
        ratings: ratings.sort()
      }
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};

module.exports = {
  searchVideos,
  getSuggestions,
  getFilterOptions
};
