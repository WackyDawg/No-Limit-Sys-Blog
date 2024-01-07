const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const Setting = require('../models/blogSettingsModel')

exports.getIndex = async (req, res) => {
    try {
      // Fetch all categories
      const allCategories = await Category.find();
  
      // Fetch categories with post counts
      const categoryCounts = await Promise.all(allCategories.map(async (category) => {
        const postCount = await Post.countDocuments({ category: category._id });
        return { category: category.name, count: postCount };
      }));
  
      // Fetch popular posts (by views)
      const popularPosts = await Post.find().sort({ views: 'desc' }).limit(5).populate('category');
      const editorsChoicePosts = await Post.find({ isEditorsChoice: true }).limit(5).populate('category');

      // Fetch recent posts
      const recentPosts = await Post.find().sort({ createdAt: 'desc' }).limit(5).populate('category');;
  
      // Fetch distinct post tags
      const postTags = await Post.distinct('tags');
  
      // Fetch all posts with category details
      const allPosts = await Post.find().populate('category', 'name');
  
      // Fetch posts for each category concurrently
      const categoryPromises = allCategories.map(async (category) => {
        const posts = await Post.find({ category: category._id }).limit(5);
        return { [category.name]: posts };
      });
      const postsByCategoryArray = await Promise.all(categoryPromises);
      const postsByCategory = Object.assign({}, ...postsByCategoryArray);
  
      // Fetch site settings
      const existingSetting = await Setting.find({});
  
      // Map posts with category names
      const postWithCategoryNames = allPosts.map((post) => ({
        ...post._doc,
        category: post.category ? post.category.name : 'Uncategorized',
      }));
  
      res.render('index', {
        categories: categoryCounts,
        categoryCounts: categoryCounts,
        postTags,
        popularPosts,
        recentPosts,
        posts: allPosts,
        postWithCategoryNames,
        allCategories,
        postsByCategory,
        existingSetting,
        editorsChoicePosts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

