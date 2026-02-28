const express = require('express');
const router = express.Router();
const {
  getPlans,
  createSubscription,
  cancelSubscription,
  getSubscriptionStatus,
  handleWebhook
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/plans', getPlans);
router.post('/create', protect, createSubscription);
router.post('/cancel', protect, cancelSubscription);
router.get('/status', protect, getSubscriptionStatus);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
