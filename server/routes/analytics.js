const express = require('express');
const router = express.Router();
const {
  trackEvent,
  updateProgress,
  getVideoStats,
  getUserAnalytics
} = require('../controllers/analyticsController');
const { protect, requireSubscription } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');

router.post('/track', protect, requireSubscription, trackEvent);
router.post('/progress', protect, requireSubscription, updateProgress);
router.get('/video/:videoId', protect, isAdmin, getVideoStats);
router.get('/user', protect, getUserAnalytics);

module.exports = router;
