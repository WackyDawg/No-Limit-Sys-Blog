const express = require('express');
const category = express.Router();
const categoryController = require('../controller/categoryController');

category.get('/', categoryController.getAllCategories);
category.get('/:id', categoryController.getCategoryById);
category.post('/', categoryController.createCategory);
category.put('/:id', categoryController.updateCategory);
category.delete('/:id', categoryController.deleteCategory);

module.exports = category;
