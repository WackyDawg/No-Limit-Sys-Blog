const express = require('express');
const post = express.Router();
const postController = require('../controller/postController');

post.get('/:id', postController.getBlogById);
post.get('/blog', postController.getAllBlogPost)
// category.get('/:id', categoryController.getCategoryById);
// category.post('/', categoryController.createCategory);
// category.put('/:id', categoryController.updateCategory);
// category.delete('/:id', categoryController.deleteCategory);

module.exports = post;
