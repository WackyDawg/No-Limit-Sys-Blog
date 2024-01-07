const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const Setting = require('../models/blogSettingsModel')

const multer = require('multer');
const fs = require('fs');
const path = require('path');

function calculateReadTime(text) {
    if (!text) {
        return 0; 
    }

    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return readTimeMinutes;
}




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

  

exports.createBlogPost =  upload.array('images', 5), async (req, res, next) => {
    try {
        if (!req.body.title || !req.body.insertMedia) {
            return res.status(400).send("Title and insertMedia are required fields");
        }

        const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
        const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];

        const { title, insertMedia } = req.body;

        const newPost = new Post({
            title: title,
            tags: tags,
            images: images,
            insertMedia: insertMedia,
        });

        // Save the new post to the database
        await newPost.save();

        // Redirect to the dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        // Handle errors appropriately
        res.status(500).send("Internal Server Error");
    }
};


exports.editBlogPost = async (req, res, next) => {

}

exports.getAllBlogPost = async (req, res, next) => {

}

exports.deleteBlogPost = async (req, res, next) => {

}

exports.getBlogById = async (req, res, next) => {
    try {
        const slug = req.params.id;


        // Fetch all categories
        const allCategories = await Category.find();

        // Fetch posts count for each category
        const categoryCounts = await Promise.all(allCategories.map(async (category) => {
            const postCount = await Post.countDocuments({ category: category._id });
            return { category: category.name, count: postCount };
        }));

        // Get the current post by ID
        const currentPost = await Post.findOne({ slug }).populate('category');
        const existingSetting = await Setting.find({});

        if (!currentPost) {
            // Handle case where post is not found
            return res.status(404).send("Post not found");
        }

        currentPost.views = (currentPost.views || 0) + 1;
        await currentPost.save();

        // Get tags of the current post
        const allPosts = await Post.find().populate('category', 'name');

        // Check if currentPostTags is an array before using $in
        const currentPostCategoryId = currentPost.category;

        // Find related posts in the same category
        const relatedPosts = currentPost.category
            ? await Post.find({ category: currentPost.category, _id: { $ne: currentPost._id } })
                .limit(5) // Limit the number of related posts
                .populate('category') // Populate the category field for related posts
            : [];

        const previousPost = await Post.findOne({
            createdAt: { $lt: currentPost.createdAt }
        })
            .sort({ createdAt: 'desc' })
            .limit(1);

        const postUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(10);
        const estimatedReadTime = calculateReadTime(currentPost.body, relatedPosts.body);
        const allTags = await Post.distinct('tags');

        // Pass the necessary data to the template
        res.render("post", {
            data: currentPost,
            posts: allPosts,
            previousPost,
            categoryCounts,
            allCategories,
            postUrl,
            existingSetting,
            relatedPosts,
            latestPosts,
            estimatedReadTime,
            allTags,
            views: currentPost.views
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

exports.getAllBlogPost = async (req, res, next) => {
    try {
        // Fetch all blog posts
        const allPosts = await Post.find().populate('category', 'name');

        // Pass the blog posts data to the template
        res.render("allPosts", { posts: allPosts });
    } catch (error) {
        console.error(error);
        // Handle errors appropriately
        res.status(500).send("Internal Server Error");
    }
};

// exports.getBlogById = async (req, res, next) => {
//     try {
//         const slug = req.params.id;

//         // Get the current post by ID
//         const currentPost = await Post.findOne({ slug });

//         if (!currentPost) {
//             // Handle case where post is not found
//             return res.status(404).send("Post not found");
//         }
        
//         currentPost.views = (currentPost.views || 0) + 1;
//         await currentPost.save();

//         // Get tags of the current post
//         const currentPostTags = currentPost.tags || [];

//         // Check if currentPostTags is an array before using $in
//         const relatedPosts = currentPostTags.length > 0
//             ? await Post.find({ tags: { $in: currentPostTags }, _id: { $ne: currentPost._id } })
//                 .limit(5) // Limit the number of related posts
//             : [];

//         const postUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//         const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(10);
//         const estimatedReadTime = calculateReadTime(currentPost.body, relatedPosts.body);
//         const allTags = await Post.distinct('tags');


//         // Pass the necessary data to the template
//         res.render("post", { data: currentPost, postUrl, relatedPosts, latestPosts, estimatedReadTime,allTags, views: currentPost.views });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// }