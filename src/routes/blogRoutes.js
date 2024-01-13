const express = require('express');
const post = express.Router();
const postController = require('../controller/postController');
const setupCheckMiddleware = require('../middleware/setupCheck');


post.get('/:id', setupCheckMiddleware, postController.getBlogById);
post.get('/blog', setupCheckMiddleware, postController.getAllBlogPost)


module.exports = post;
