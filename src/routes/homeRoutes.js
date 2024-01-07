const express = require('express');
const home = express.Router();
const homeController = require('../controller/homeController');

home.get('/', homeController.getIndex);
// category.get('/:id', categoryController.getCategoryById);
// category.post('/', categoryController.createCategory);
// category.put('/:id', categoryController.updateCategory);
// category.delete('/:id', categoryController.deleteCategory);

module.exports = home;
