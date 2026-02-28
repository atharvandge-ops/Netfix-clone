const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');
const Video = require('../models/Video');
const User = require('../models/User');

const trackEvent = async (req, res) => {
  try {
    const { videoId, action, watchDuration, deviceType, browser, quality } = req.body;
    const userId = req.user.id;

    if (!videoId || !action) {
      return res.status(400).json({
        success: false,
        message: 'Video ID and action are required'
      });
    }

    const analytics = await Analytics.create({
      userId,
      videoId,
      action,
      watchDuration: watchDuration || 0,
      deviceType: deviceType || 'unknown',
      browser,
      quality
    });

    if (action === 'view') {
      const user = await User.findById(userId);
      const existingHistory = user.watchHistory.find(
        h => h.videoId.toString() === videoId
      );

      if (!existingHistory) {
        user.watchHistory.push({
          videoId,
          watchedAt: new Date(),
          progress: 0
        });
      } else {
        existingHistory.watchedAt = new Date();
      }

      await user.save();
    }

    if (action === 'complete') {
      const user = await User.findById(userId);
      const historyItem = user.watchHistory.find(
        h => h.videoId.toString() === videoId
      );

      if (historyItem) {
        historyItem.completed = true;
        historyItem.progress = 100;
        await user.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Event tracked successfully',
      data: { analytics }
    });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking event',
      error: error.message
    });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { videoId, progress } = req.body;
    const userId = req.user.id;

    if (!videoId || progress === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Video ID and progress are required'
      });
    }

    const user = await User.findById(userId);
    const historyItem = user.watchHistory.find(
      h => h.videoId.toString() === videoId
    );

    if (historyItem) {
      historyItem.progress = progress;
      historyItem.watchedAt = new Date();
      
      if (progress >= 90) {
        historyItem.completed = true;
      }
    } else {
      user.watchHistory.push({
        videoId,
        progress,
        watchedAt: new Date(),
        completed: progress >= 90
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

const getVideoStats = async (req, res) => {
  try {
    const { videoId } = req.params;

    const totalViews = await Analytics.countDocuments({
      videoId,
      action: 'view'
    });

    const completionRate = await Analytics.aggregate([
      {
        $match: {
          videoId: mongoose.Types.ObjectId(videoId),
          action: { $in: ['view', 'complete'] }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    const views = completionRate.find(r => r._id === 'view')?.count || 0;
    const completes = completionRate.find(r => r._id === 'complete')?.count || 0;
    const rate = views > 0 ? ((completes / views) * 100).toFixed(2) : 0;

    const avgWatchDuration = await Analytics.aggregate([
      {
        $match: {
          videoId: mongoose.Types.ObjectId(videoId),
          watchDuration: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$watchDuration' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalViews,
        completionRate: rate,
        averageWatchDuration: avgWatchDuration[0]?.avgDuration || 0
      }
    });
  } catch (error) {
    console.error('Get video stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video statistics',
      error: error.message
    });
  }
};

const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalWatched = await Analytics.countDocuments({
      userId,
      action: 'view'
    });

    const totalCompleted = await Analytics.countDocuments({
      userId,
      action: 'complete'
    });

    const topGenres = await Analytics.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          action: 'view'
        }
      },
      {
        $lookup: {
          from: 'videos',
          localField: 'videoId',
          foreignField: '_id',
          as: 'video'
        }
      },
      { $unwind: '$video' },
      { $unwind: '$video.genre' },
      {
        $group: {
          _id: '$video.genre',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalWatched,
        totalCompleted,
        topGenres
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user analytics',
      error: error.message
    });
  }
};

module.exports = {
  trackEvent,
  updateProgress,
  getVideoStats,
  getUserAnalytics
};
