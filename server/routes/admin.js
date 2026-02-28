const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllVideosAdmin,
  createPlan,
  updatePlan
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');

router.use(protect, isAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);
router.get('/videos', getAllVideosAdmin);
router.post('/plans', createPlan);
router.put('/plans/:planId', updatePlan);

module.exports = router;
