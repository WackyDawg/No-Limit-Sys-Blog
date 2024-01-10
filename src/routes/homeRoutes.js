const express = require('express');
const home = express.Router();
const homeController = require('../controller/homeController');
const setupCheckMiddleware = require('../middleware/setupCheck');


home.get('/', homeController.getIndex);
home.get('/hot-posts', homeController.hotPosts);
home.get('/blog', homeController.getAllBlogPost);
home.get('/Contact', homeController.getContact);
home.post('/contact', homeController.postContact);
home.get('/admin/login', homeController.login);
home.post('/admin/login', homeController.postLogin);

// category.get('/:id', categoryController.getCategoryById);
// category.post('/', categoryController.createCategory);
// category.put('/:id', categoryController.updateCategory);
// category.delete('/:id', categoryController.deleteCategory);

module.exports = home;
