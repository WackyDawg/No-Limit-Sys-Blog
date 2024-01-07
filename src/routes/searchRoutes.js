const express = require('express')
const search = express.Router();
const searchController = require('../controller/searchController')

search.post('/search', searchController.searchBlogPost)

module.exports = search;