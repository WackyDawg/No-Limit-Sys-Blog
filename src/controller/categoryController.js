const Category = require('../models/categoryModel');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getCategoryById = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createCategory = async (req, res, next) => {
  const { name } = req.body;
  try {
    const newCategory = await Category.create({ name });
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  try {
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

