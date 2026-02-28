const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getWatchHistory,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = require('../controllers/userController');
const { protect, requireSubscription } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/history', protect, requireSubscription, getWatchHistory);
router.get('/favorites', protect, requireSubscription, getFavorites);
router.post('/favorites/:videoId', protect, requireSubscription, addToFavorites);
router.delete('/favorites/:videoId', protect, requireSubscription, removeFromFavorites);

module.exports = router;
