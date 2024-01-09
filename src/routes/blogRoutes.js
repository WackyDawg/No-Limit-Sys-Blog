const express = require('express');
const post = express.Router();
const postController = require('../controller/postController');

post.get('/:id', postController.getBlogById);
post.get('/blog', postController.getAllBlogPost)


module.exports = post;
