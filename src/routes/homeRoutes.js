const express = require('express');
const home = express.Router();
const homeController = require('../controller/homeController');
const setupCheckMiddleware = require('../middleware/setupCheck');


home.get('/', homeController.getIndex);
home.get('/blog', homeController.getAllBlogPost);
home.get('/Contact', homeController.getContact);
home.post('/contact', homeController.postContact);
// category.get('/:id', categoryController.getCategoryById);
// category.post('/', categoryController.createCategory);
// category.put('/:id', categoryController.updateCategory);
// category.delete('/:id', categoryController.deleteCategory);

module.exports = home;
