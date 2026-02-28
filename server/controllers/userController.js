const User = require('../models/User');
const Video = require('../models/Video');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -refreshToken')
      .populate('subscriptionPlan')
      .lean();

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;
    const userId = req.user.id;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (profileImage) updates.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

const getWatchHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: 'watchHistory.videoId',
        select: 'title thumbnail duration genre category'
      })
      .lean();

    const history = user.watchHistory
      .filter(h => h.videoId)
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
      .slice((page - 1) * limit, page * limit);

    const totalCount = user.watchHistory.filter(h => h.videoId).length;

    res.status(200).json({
      success: true,
      data: {
        history,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        total: totalCount
      }
    });
  } catch (error) {
    console.error('Get watch history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching watch history',
      error: error.message
    });
  }
};

const addToFavorites = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const user = await User.findById(userId);
    
    if (user.favorites.includes(videoId)) {
      return res.status(400).json({
        success: false,
        message: 'Video already in favorites'
      });
    }

    user.favorites.push(videoId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Added to favorites'
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message
    });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    user.favorites = user.favorites.filter(
      id => id.toString() !== videoId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate({
        path: 'favorites',
        select: 'title thumbnail duration genre category views'
      })
      .lean();

    res.status(200).json({
      success: true,
      data: { favorites: user.favorites }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getWatchHistory,
  addToFavorites,
  removeFromFavorites,
  getFavorites
};
