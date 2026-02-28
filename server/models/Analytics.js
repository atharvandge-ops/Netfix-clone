const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  action: {
    type: String,
    enum: ['view', 'complete', 'pause', 'resume', 'seek', 'like', 'unlike'],
    required: true
  },
  watchDuration: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet', 'tv', 'unknown'],
    default: 'unknown'
  },
  browser: {
    type: String
  },
  quality: {
    type: String
  }
}, {
  timestamps: true
});

analyticsSchema.index({ userId: 1, videoId: 1 });
analyticsSchema.index({ videoId: 1, action: 1 });
analyticsSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
