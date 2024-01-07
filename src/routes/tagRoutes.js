const express = require('express');
const router = express.Router();
const tagController = require('../controller/tagController');

// Define a route to get posts by tag
//router.get('/:tag', tagController.getPostsByTag);
router.get('/tags/suggestions', tagController.getTagSuggestions);


module.exports = router;
