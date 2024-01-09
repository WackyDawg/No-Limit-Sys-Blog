const connectDB = require('../config/db');
const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const Setting = require('../models/blogSettingsModel');
const Contact = require('../models/contactModel')
const installController = require('../controller/installController');
const setupCheckMiddleware = require('../middleware/setupCheck');
const fs = require('fs');
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

        // Proceed with your regular route handling
        // For example, you can render your main application page

  
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
    res.render('auth/login', { layout: authLayout})
  } catch (error) {
    console.log(error)
  }
}

exports.postLogin = async (req, res) => {
  try {
      const { email, password } = req.body;

      const db = await connectDB();
      const User = db.collection('users');

      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
          // User not found
          return res.status(401).render('login', { error: 'Invalid credentials' });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          // Incorrect password
          return res.status(401).render('login', { error: 'Invalid credentials' });
      }

      // Check if the user is an admin
      if (user.role !== 'admin') {
          // Only allow admin login
          return res.status(403).render('login', { error: 'Access forbidden' });
      }

      // Set up a session or token for the logged-in user

      // Redirect to the admin dashboard or system settings
      return res.status(200).redirect('/admin_dashboard');
  } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).render('errors/500');
  }
};

exports.hotPosts = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const popularPosts = await Post.find().sort({ views: 'desc' })
    .limit(10)
    .populate('category');
    
    const allPosts = await Post.find().populate('category', 'name');

    res.render('hotposts', { posts: allPosts, existingSetting, popularPosts })
  } catch (error) {
    
  }
}

