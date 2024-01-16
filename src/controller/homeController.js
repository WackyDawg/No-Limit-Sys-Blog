const fs = require('fs');
const connectDB = require('../config/db');
const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const Setting = require('../models/blogSettingsModel');
const Contact = require('../models/contactModel');
const Subscriber = require('../models/subscribersModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const installController = require('../controller/installController');
const setupCheckMiddleware = require('../middleware/setupCheck');
const authMiddleware = require('../middleware/authMiddleware');
const setupLayout = '../views/layouts/setup';
const authLayout = '../views/layouts/auth';


exports.getIndex = async (req, res) => {
    try {
      const locals = {
        title: "",
        description: ""
      }

      const db = await connectDB().catch(err => {
        console.error(err);
        throw new Error('Failed to connect to the database');
    });
          // Fetch all categories
      const allCategories = await Category.find().maxTimeMS(30000); // 30 seconds timeout
  
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
      const isInstalled = fs.existsSync('.env') && fs.existsSync('installed.txt');

        if (!isInstalled) {
          // If the application is not installed, render a specific page
          return res.render('installation/index', { layout: setupLayout});
        }

  
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
  
  exports.getContact = async (req, res) => {
    try {
      const locals = {
        title: "Contact",
        description: ""
      }
      const allPosts = await Post.find().populate('category', 'name');
      const existingSetting = await Setting.find({});
      res.render('Contact', { posts: allPosts, existingSetting, locals})
    } catch (error) {
      
    }
  }

  exports.postContact = async (req, res) => {
    try {
      if (!req.body.name || !req.body.email || !req.body.phone || !req.body.subject || !req.body.message) {
        return res.status(400).send("Every field is required");
      }
  
      const { name, email, phone, subject, message } = req.body;
  
      const newContact = new Contact({
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
      });
  
      await newContact.save(); // Use save() instead of Save()
  
      res.redirect('/contact');
    } catch (error) {
      console.error(error);
      res.status(500).render('error/500'); // Render a '500' error page for server errors
    }
  };
  
  exports.postSubscribe = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).send("Every Field Is Required");
      }
  
      console.log(req.body);
  
      const newSubscriber = new Subscriber({
        email: email
      });
  
      await newSubscriber.save();
      res.status(200).send("Subscription successful!"); // Sending a success response
  
    } catch (error) {
      console.error("Error in try-catch block: ", error);
      res.status(500).send("Internal server error");
    }
  };
  

  exports.getAllBlogPost = async (req, res, next) => {
    try {
      const locals = {
        title: "Blog",
        description: ""
      }
      const db = await connectDB();
        // Get the current page from the query parameters, default to 1 if not provided
        const page = parseInt(req.query.page) || 1;
        // Set the number of posts per page
        const postsPerPage = 10;

        // Fetch total number of blog posts (for calculating total pages)
        const totalPosts = await Post.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        // Calculate the skip value based on the current page
        const skip = (page - 1) * postsPerPage;

        // Fetch 10 blog posts for the current page
        const allPosts = await Post.find()
            .populate('category', 'name')
            .skip(skip)
            .limit(postsPerPage);

        const existingSetting = await Setting.find({});

        // Calculate the starting count value for the current page
        const startingCount = (page - 1) * postsPerPage + 1;

        // Pass the blog posts data and pagination information to the template
        res.render("allPosts", { posts: allPosts,locals, existingSetting, currentPage: page, totalPages, startingCount });
    } catch (error) {
        console.error(error);
        // Handle errors appropriately
        res.status(500).send("Internal Server Error");
    }
};


exports.login = async (req, res, next) => {
  try {
    const existingSetting = await Setting.find({});
    res.render('auth/login', { layout: authLayout, existingSetting})
  } catch (error) {
    console.log(error)
  }
}

const jwtSecret = process.env.JWT_SECRET || 'tested';

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/admin');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/'); 
};


exports.hotPosts = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const admin = await User.findOne(); 
    const allCategories = await Category.find().maxTimeMS(30000); // 30 seconds timeout
  
    // Fetch categories with post counts
    const categoryCounts = await Promise.all(allCategories.map(async (category) => {
      const postCount = await Post.countDocuments({ category: category._id });
      return { category: category.name, count: postCount };
    }));

    const popularPosts = await Post.find().sort({ views: 'desc' })
    .limit(10)
    .populate('category');
    
    const allPosts = await Post.find().populate('category', 'name');

    res.render('hotposts', { posts: allPosts, existingSetting, popularPosts,admin,categoryCounts: categoryCounts,
    })
  } catch (error) {
    
  }
}

 