const Video = require('../models/Video');
const { uploadVideo, uploadImage, deleteResource } = require('../utils/cloudinaryUpload');

const getAllVideos = async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, category, sort = '-createdAt' } = req.query;

    const query = { isPublished: true };

    if (genre) {
      query.genre = genre;
    }

    if (category) {
      query.category = category;
    }

    const videos = await Video.find(query)
      .sort(sort)
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
        totalVideos: count
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: error.message
    });
  }
};

const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id)
      .populate('uploadedBy', 'name email')
      .lean();

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    if (!video.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'This video is not available'
      });
    }

    res.status(200).json({
      success: true,
      data: { video }
    });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video',
      error: error.message
    });
  }
};

const uploadNewVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      genre,
      category,
      releaseYear,
      rating,
      cast,
      director
    } = req.body;

    if (!req.files || !req.files.video || !req.files.thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Video and thumbnail files are required'
      });
    }

    const videoResult = await uploadVideo(req.files.video[0].buffer);
    const thumbnailResult = await uploadImage(req.files.thumbnail[0].buffer);

    const video = await Video.create({
      title,
      description,
      thumbnail: thumbnailResult.secure_url,
      videoUrl: videoResult.secure_url,
      duration: parseInt(duration),
      genre: Array.isArray(genre) ? genre : genre.split(','),
      category,
      releaseYear: parseInt(releaseYear),
      rating,
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(',') : []),
      director,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      data: { video }
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading video',
      error: error.message
    });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        video[key] = updates[key];
      }
    });

    await video.save();

    res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      data: { video }
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating video',
      error: error.message
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    await Video.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting video',
      error: error.message
    });
  }
};

const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { views: video.views }
    });
  } catch (error) {
    console.error('Increment views error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating views',
      error: error.message
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { like } = req.body;

    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { likes: like ? 1 : -1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { likes: video.likes }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating likes',
      error: error.message
    });
  }
};

module.exports = {
  getAllVideos,
  getVideoById,
  uploadNewVideo,
  updateVideo,
  deleteVideo,
  incrementViews,
  toggleLike
};
