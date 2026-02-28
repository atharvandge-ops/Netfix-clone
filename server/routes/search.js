const express = require('express');
const router = express.Router();
const { searchVideos, getSuggestions, getFilterOptions } = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

router.get('/', protect, searchVideos);
router.get('/suggestions', getSuggestions);
router.get('/filters', getFilterOptions);

module.exports = router;
