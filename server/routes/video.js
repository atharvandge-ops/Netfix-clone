const express = require('express');
const router = express.Router();
const {
  getAllVideos,
  getVideoById,
  uploadNewVideo,
  updateVideo,
  deleteVideo,
  incrementViews,
  toggleLike
} = require('../controllers/videoController');
const { protect, requireSubscription } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');
const upload = require('../utils/uploadConfig');

router.get('/', getAllVideos);
router.get('/:id', protect, requireSubscription, getVideoById);
router.post('/', protect, isAdmin, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), uploadNewVideo);
router.put('/:id', protect, isAdmin, updateVideo);
router.delete('/:id', protect, isAdmin, deleteVideo);
router.post('/:id/view', protect, requireSubscription, incrementViews);
router.post('/:id/like', protect, requireSubscription, toggleLike);

module.exports = router;
