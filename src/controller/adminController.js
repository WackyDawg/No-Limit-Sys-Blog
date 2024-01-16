const Category = require("../models/categoryModel");
const Post = require("../models/postModel");
const Setting = require("../models/blogSettingsModel");
const Contact = require("../models/contactModel")
const User = require("../models/userModel");
const Subscriber = require('../models/subscribersModel');
const multer = require("multer");
const nodemailer = require('nodemailer');
const { validationResult } = require("express-validator");
const { promisify } = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const path = require("path");
const bcrypt = require("bcrypt");
const { isAuthenticated } = require("../middleware/authMiddleware");

const mongoose = require("mongoose");

const adminLayout = "../views/layouts/admin";
const errorLayout = "../views/layouts/error.ejs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../public/uploads");
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

exports.getAdminIndex = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    const postCount = await Post.countDocuments();
    const categoryCount = await Category.countDocuments();
    const subscribersCount = await Subscriber.countDocuments();

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    res.render("admin/index", {
      layout: adminLayout,
      currentUser,
      postCount,
      categoryCount,
      subscribersCount,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});

    // Check if req.user exists and has the userId property
    //const userId = req.user?.userId;
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    // Add more detailed error handling for the User.findById operation
    //const user = await User.findById(userId);

    // if (!user) {
    //   // If user is not found, handle it appropriately (send a response, redirect, etc.)
    //   return res.status(404).render('errors/404', { layout: errorLayout });
    // }
    //console.log(currentUser)
    res.render("admin/profile", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    console.error("Error in getAdminProfile:", error);

    // Render a 500 error page with the detailed error information
    res.status(500).render("errors/500", { layout: errorLayout, error });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    // Validate request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Use Multer middleware to handle file uploads
    upload.fields([
      { name: "avatar", maxCount: 5 }, // New image field
    ])(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "File upload error" });
      }

      try {
        const avatar =
          req.files && req.files["avatar"]
            ? req.files["avatar"].map(
                (file) => `../public/uploads/${file.filename}`
              )
            : [];

        // Find the existing setting or create a new one if none exists
        const existingAdmin = await User.findOneAndUpdate(
          { role: "admin" },
          {},
          { upsert: true, new: true }
        );

        // Update fields based on the values present in the request
        const fieldsToUpdate = [
          "name",
          "email",
          "biography",
          "password",
          "facebook_link",
          "twitter_link",
          "instagram_link",
          "youtube_link",
          "tiktok_link",
          "confirm_password",
        ];

        fieldsToUpdate.forEach(async (field) => {
          if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            if (field === "password") {
              // Check if password and password confirmation match
              if (req.body.password !== req.body.confirm_password) {
                return res.status(400).json({
                  message: "Password and password confirmation do not match",
                });
              }

              // Hash the new password before saving
              const hashedPassword = await bcrypt.hash(req.body[field], 10);

              existingAdmin[field] = hashedPassword;
            } else {
              existingAdmin[field] = req.body[field];
            }
          }
        });

        // Update the image fields based on the values present in the request
        if (avatar.length > 0) {
          existingAdmin.avatar = avatar;
        }

        await existingAdmin.save();

        console.log("Setting saved to the database:", existingAdmin);

        res.status(200).redirect("/admin/profile");
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating setting" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAdminBlog = async (req, res) => {
  try {
    const posts = await Post.find().populate("category");
    const postWithCategoryNames = posts.map((post) => ({
      ...post._doc,
      category: post.category ? post.category.name : "Uncategorized",
    }));
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    res.render("admin/blog", {
      layout: adminLayout,
      post: postWithCategoryNames,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAdminBlogCreate = async (req, res) => {
  try {
    const categories = await Category.find();
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }
    res.render("admin/blog-create", {
      layout: adminLayout,
      currentUser,
      categories,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postAdminBlogCreate = async (req, res) => {
  try {
    // Use Multer middleware to handle file uploads
    upload.array("banner", "meta_img", 5)(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "File upload error" });
      }

      // Continue with processing form data after files are uploaded

      try {
        const uploadedBanners = req.files
          ? req.files.map((file) => `../public/uploads/${file.filename}`)
          : [];

        const tags = req.body.tags
          ? req.body.tags.split(",").map((tag) => tag.trim())
          : [];

        const {
          title,
          category_id,
          slug,
          short_description,
          description,
          meta_title,
          meta_description,
          meta_keywords,
        } = req.body;

        console.log(req.body);

        const newBlog = new Post({
          title,
          category: category_id,
          slug,
          banner: uploadedBanners,
          short_description,
          description,
          meta_title,
          tags: tags,
          meta_img: uploadedBanners,
          meta_description,
          meta_keywords,
        });

        await newBlog.save();

        res.redirect("/admin/blog");
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating blog post" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAdminBlogEdit = async (req, res) => {
  try {
    const postId = req.params.id;
    const categories = await Category.find();
    const currentPost = await Post.findById(postId);
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    if (!currentPost) {
      // Handle case where post is not found
      return res.status(404).send("Post not found");
    }
    res.render("admin/blog-edit", {
      data: currentPost,
      layout: adminLayout,
      categories,
      currentUser,
      existingSetting,
    });
  } catch (error) {}
};

exports.postAdminBlogEdit = async (req, res) => {
  try {
    // Validate request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Use Multer middleware to handle file uploads
    upload.array("banner", "meta_img", 5)(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "File upload error" });
      }

      try {
        const uploadedBanners = req.files
          ? req.files.map((file) => `../public/uploads/${file.filename}`)
          : [];

        const tags = req.body.tags
          ? req.body.tags.split(",").map((tag) => tag.trim())
          : [];

        const {
          title,
          category_id,
          slug,
          short_description,
          description,
          meta_title,
          meta_description,
          meta_keywords,
          author,
          publish_date,
          status,
          isEditorsChoice,
        } = req.body;

        // Convert isEditorsChoice to boolean
        const editorsChoice =
          isEditorsChoice === "true" ||
          isEditorsChoice === true ||
          isEditorsChoice === "on";

        console.log("Checkbox value:", isEditorsChoice);
        console.log("isEditorsChoice:", editorsChoice);

        // Find and update the existing post
        const postId = req.params.id;
        const existingPost = await Post.findByIdAndUpdate(
          postId,
          {
            title,
            category: category_id,
            slug,
            short_description,
            description,
            meta_title,
            tags,
            isEditorsChoice: editorsChoice,
            meta_description,
            meta_keywords,
            author,
            publish_date,
            status,
            // Add other fields here
          },
          { new: true }
        );

        if (!existingPost) {
          return res.status(404).json({ message: "Blog post not found" });
        }

        // Preserve existing banners and meta_img if not updated
        if (uploadedBanners.length > 0) {
          existingPost.banner = uploadedBanners;
        }

        if (existingPost.meta_img.length === 0) {
          existingPost.meta_img = uploadedBanners;
        }

        await existingPost.save();

        res.redirect("/admin/blog");
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating blog post" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteAdminBlogPost = async (req, res) => {
  const postId = req.params.id; // Extract postId from req.params

  try {
    // Check if the post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await Post.findByIdAndDelete(postId);

    // Optionally, you can redirect to a different page or send a success message
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting blog post' });
  }
};

exports.getAdminCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    const existingSetting = await Setting.find({});
    const currentUser = req.user;  // Assuming you have user information attached to the request

    // Check if the user is authenticated
    if (!currentUser) {
      // If userId is not available, handle it appropriately (render an error page, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    // Render the admin category page with the necessary data
    res.render("admin/blog-category", {
      layout: adminLayout,
      currentUser,
      categories,
      existingSetting
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Render an error page with a friendly message for the user
    res.status(500).render("errors/500", { layout: errorLayout });
  }
};


exports.createAdminCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    const existingSetting = await Setting.find({});
    const currentUser = req.user;  // Assuming you have user information attached to the request

    // Check if the user is authenticated
    if (!currentUser) {
      // If userId is not available, handle it appropriately (render an error page, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }
    res.render("admin/category-create", {
      layout: adminLayout,
      categories,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postAdminCategory = async (req, res) => {
  upload.array("banner", 5)(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "File upload error" });
    }

    // Continue with processing form data after files are uploaded

    try {
      const uploadedBanners = req.files
        ? req.files.map((file) => `../public/uploads/${file.filename}`)
        : [];

      const { name, short_description } = req.body;

      console.log(req.body);

      const newCategory = new Category({
        name,
        banner: uploadedBanners,
        short_description,
      });

      await newCategory.save();

      res.redirect("/admin/blog-category");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating blog post" });
    }
  });
};

exports.getAdminCategoryEdit = async (req, res) => {
  try {
    const catId = req.params.id;
    
    // Find the current category by ID
    const currentCategory = await Category.findById(catId);
    
    // Find all existing settings
    const existingSetting = await Setting.find({});
    
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    if (!currentCategory) {
      return res.status(404).send("category not found");
    }

    // Create a new category if it doesn't exist
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: catId },
      { $setOnInsert: { /* fields to be created */ } },
      { upsert: true, new: true },
    );

    res.render("admin/category-edit", {
      data: updatedCategory,
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    // Add error handling code here
  }
};

exports.deleteAdminBlogCategory = async (req, res) => {
  const catId = req.params.id; // Extract postId from req.params

  try {
    const category = await Category.findById(catId);

    if (!category) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await Category.findByIdAndDelete(catId);

    // Optionally, you can redirect to a different page or send a success message
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting blog post' });
  }
};


exports.editAdminCategory = async (req, res) => {
  upload.array("banner", 5)(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "File upload error" });
    }

    try {
      const categoryId = req.params.id;

      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const uploadedBanners = req.files
        ? req.files.map((file) => `../public/uploads/${file.filename}`)
        : category.banner; 

      const { name, short_description } = req.body;

      console.log(req.body);

      category.name = name;
      category.banner = uploadedBanners;
      category.short_description = short_description;

      await category.save();

      res.redirect("/admin/blog-category");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error editing blog category" });
    }
  });
};


exports.getAdminSettingHeader = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }
    console.log("Existing Setting:", existingSetting);
    res.render("admin/settings/header", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateAdminSettingHeader = async (req, res) => {
  try {
    // Validate request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Use Multer middleware to handle file uploads
    upload.fields([
      { name: "headerlogo", maxCount: 5 },
      { name: "footerlogo", maxCount: 5 },
      { name: "site_icon", maxCount: 5 },
      { name: "meta_image", maxCount: 5 },
      { name: "system_logo", maxCount: 5 }, // New image field
    ])(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "File upload error" });
      }

      try {
        const uploadedBanners2 =
          req.files && req.files["footerlogo"]
            ? req.files["footerlogo"].map(
                (file) => `../public/uploads/${file.filename}`
              )
            : [];
        const uploadedBanners =
          req.files && req.files["headerlogo"]
            ? req.files["headerlogo"].map(
                (file) => `../public/uploads/${file.filename}`
              )
            : [];
        const site_icon =
          req.files && req.files["site_icon"]
            ? req.files["site_icon"].map(
                (file) => `../public/uploads/${file.filename}`
              )
            : [];
        const system_logo =
          req.files && req.files["system_logo"]
            ? req.files["system_logo"].map(
                (file) => `../public/uploads/${file.filename}`
              )
            : [];
        const meta_image =
          req.files && req.files["meta_image"]
            ? req.files["meta_image"].map(
                (file) => `../public/uploads/${file.filename}`
              )
            : [];

        // Find the existing setting or create a new one if none exists
        const existingSetting = await Setting.findOneAndUpdate(
          {},
          {},
          { upsert: true, new: true }
        );

        // Update fields based on the values present in the request
        const fieldsToUpdate = [
          "header_sticky",
          "site_name",
          "website_name",
          "site_motto",
          "base_color",
          "base_hov_color",
          "secondary_base_color",
          "secondary_base_hov_color",
          "meta_title",
          "meta_description",
          "meta_keywords",
          "cookies_description",
          "show_cookies_agreement",
          "show_website_popup",
          "popup_description",
          "show_subscribe_form",
          "header_script",
          "footer_script",
          "show_social_links",
          "contact_address",
          "phonenumber",
          "frontend_copyright_text",
          "play_store_link",
          "contact_phone",
          "app_store_link",
          "facebook_link",
          "twitter_link",
          "instagram_link",
          "youtube_link",
          "linkedin_link",
          "contact_email",
          "copywritetext",
          "description",
        ];

        fieldsToUpdate.forEach((field) => {
          if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            existingSetting[field] = req.body[field];
          }
        });

        // Update the checkbox fields only if the corresponding request parameter is present
        const checkboxFields = [
          "header_sticky",
          "show_social_links",
          "show_cookies_agreement",
          "show_website_popup",
          "show_subscribe_form",
        ];

        checkboxFields.forEach((field) => {
          if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            existingSetting[field] = req.body[field] === "on";
          }
        });

        // Update the image fields based on the values present in the request
        if (uploadedBanners.length > 0) {
          existingSetting.headerlogo = uploadedBanners;
        }

        if (site_icon.length > 0) {
          existingSetting.site_icon = site_icon;
        }

        if (system_logo.length > 0) {
          existingSetting.system_logo = system_logo;
        }

        if (meta_image.length > 0) {
          existingSetting.meta_image = meta_image;
        }

        if (uploadedBanners2.length > 0) {
          existingSetting.footerlogo = uploadedBanners2;
        }

        await existingSetting.save();

        console.log("Setting saved to the database:", existingSetting);

        res.status(200).json({ success: true });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating setting" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAdminSettingFooter = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }
    res.render("admin/settings/footer", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAdminSettingAppearance = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    res.render("admin/settings/appearance", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAdminSettingFeature = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    res.render("admin/settings/activation", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAdminSettinglogin = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    res.render("admin/settings/social-login", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAdminSettingSmtp = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }

    res.render("admin/settings/smtp-settings", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postAdminEnvSetting = async (req, res) => {
  try {
    const {
      MAIL_DRIVER,
      MAIL_HOST,
      MAIL_PORT,
      MAIL_USERNAME,
      MAIL_PASSWORD,
      MAIL_ENCRYPTION,
      MAIL_FROM_ADDRESS,
      MAIL_FROM_NAME,
      MAILGUN_DOMAIN,
      MAILGUN_SECRET,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      FACEBOOK_CLIENT_ID,
      FACEBOOK_CLIENT_SECRET,
      TWITTER_CLIENT_ID,
      TWITTER_CLIENT_SECRET,
      SIGN_IN_WITH_APPLE_LOGIN,
      SIGN_IN_WITH_APPLE_REDIRECT,
      SIGN_IN_WITH_APPLE_CLIENT_ID,
      SIGN_IN_WITH_APPLE_CLIENT_SECRET,
    } = req.body;

    // Read the existing content of the .env file
    const envFilePath = ".env";
    const existingContent = await readFileAsync(envFilePath, "utf-8");

    // Update the relevant lines in the existing content
    const updatedContent = existingContent
      .replace(/^MAIL_DRIVER=.*/m, `MAIL_DRIVER=${MAIL_DRIVER}`)
      .replace(/^MAIL_HOST=.*/m, `MAIL_HOST=${MAIL_HOST}`)
      .replace(/^MAIL_PORT=.*/m, `MAIL_PORT=${MAIL_PORT}`)
      .replace(/^MAIL_USERNAME=.*/m, `MAIL_USERNAME=${MAIL_USERNAME}`)
      .replace(/^MAIL_PASSWORD=.*/m, `MAIL_PASSWORD=${MAIL_PASSWORD}`)
      .replace(/^MAIL_ENCRYPTION=.*/m, `MAIL_ENCRYPTION=${MAIL_ENCRYPTION}`)
      .replace(
        /^MAIL_FROM_ADDRESS=.*/m,
        `MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS}`
      )
      .replace(/^MAIL_FROM_NAME=.*/m, `MAIL_FROM_NAME=${MAIL_FROM_NAME}`)
      .replace(/^MAILGUN_DOMAIN=.*/m, `MAILGUN_DOMAIN=${MAILGUN_DOMAIN}`)
      .replace(/^MAILGUN_SECRET=.*/m, `MAILGUN_SECRET=${MAILGUN_SECRET}`)
      .replace(/^GOOGLE_CLIENT_ID=.*/m, `GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}`)
      .replace(
        /^GOOGLE_CLIENT_SECRET=.*/m,
        `GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}`
      )
      .replace(
        /^FACEBOOK_CLIENT_ID=.*/m,
        `FACEBOOK_CLIENT_ID=${FACEBOOK_CLIENT_ID}`
      )
      .replace(
        /^FACEBOOK_CLIENT_SECRET=.*/m,
        `FACEBOOK_CLIENT_SECRET=${FACEBOOK_CLIENT_SECRET}`
      )
      .replace(
        /^TWITTER_CLIENT_ID=.*/m,
        `TWITTER_CLIENT_ID=${TWITTER_CLIENT_ID}`
      )
      .replace(
        /^TWITTER_CLIENT_SECRET=.*/m,
        `TWITTER_CLIENT_SECRET=${TWITTER_CLIENT_SECRET}`
      )
      .replace(
        /^SIGN_IN_WITH_APPLE_LOGIN=.*/m,
        `SIGN_IN_WITH_APPLE_LOGIN=${SIGN_IN_WITH_APPLE_LOGIN}`
      )
      .replace(
        /^SIGN_IN_WITH_APPLE_CLIENT_ID=.*/m,
        `SIGN_IN_WITH_APPLE_CLIENT_ID=${SIGN_IN_WITH_APPLE_CLIENT_ID}`
      )
      .replace(
        /^SIGN_IN_WITH_APPLE_CLIENT_SECRET=.*/m,
        `SIGN_IN_WITH_APPLE_CLIENT_SECRET=${SIGN_IN_WITH_APPLE_CLIENT_SECRET}`
      );

    // Save the updated content back to the .env file
    await writeFileAsync(envFilePath, updatedContent, { encoding: "utf-8" });

    res.redirect("/admin/smtp-settings");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
exports.getAdminSupportTickets = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const supportTicket = await Contact.find({});

    const currentUser = req.user;
    if(!currentUser) {
      return res.status(401).render('errors/401', { layout: errorLayout })
    }
    res.render('admin/support_ticket', { layout: adminLayout, existingSetting,currentUser,supportTicket })
  } catch (error) {
    
  }
}

// exports.getSupportTicketById = async (req, res) => {
//   try {
//     const contactId = req.params.id;
    
//     // Find the current category by ID
//     const currentTicket = await Contact.findById(contactId);
//     if(!currentTicket) {
//       return res.status(401).render('errors/401', { layout: errorLayout })
//     }
//     res.render('admin/')
//   } catch (error) {
    
//   }
// }

exports.getNewsletter = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const Subscribers = await Subscriber.find({});
    const currentUser = req.user;

    if(!currentUser) {
      return res.status(401).render('errors/401', { layout: errorLayout })
    }
    res.render('admin/marketing/newsletter', { layout: adminLayout, currentUser, existingSetting ,Subscribers} )
  } catch (error) {
    res.status(404).render('errors/404', { layout: errorLayout })
  }
}

exports.getAllSubscribers = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const Subscribers = await Subscriber.find({});
    const currentUser = req.user;

    if(!currentUser) {
      return res.status(401).render('errors/401', { layout: errorLayout })
    }
    res.render('admin/subscribers', { layout: adminLayout, currentUser, existingSetting ,Subscribers} )
  } catch (error) {
    res.status(404).render('errors/404', { layout: errorLayout })
  }
}


exports.deleteSubscriberById = async (req, res) => {
  const subId = req.params.id; // Extract postId from req.params

  try {
    const subscriber = await Subscriber.findById(subId);

    if (!subscriber) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await Subscriber.findByIdAndDelete(subId);

    // Optionally, you can redirect to a different page or send a success message
    res.status(200).json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting Subscriber' });
  }
};

// Helper function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id) {
  const { ObjectId } = require('mongoose').Types;
  return ObjectId.isValid(id);
}

exports.sendBulkMail = async (req, res) => {
  try {
    if (!req.body.emails || !req.body.subject || !req.body.content) {
      return res.status(400).send("Every field is required");
    }

    const { emails, subject, content} = req.body;

    console.log(req.body)
    
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "juliannwadinobi098@gmail.com",
        pass: "jzwl ucgy ccrq iszk",
      },
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });


    const mailOptions = {
      from: "juliannwadinobi098@gmail.com",
      to: emails, 
      subject: subject,
      text: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: ", info.response);
        res.redirect('/admin/newsletter');
      }
    });
  } catch (error) {
    console.error("Error in try-catch block: ", error);
    res.status(500).send("Internal server error");
  }
};


// exports.sendBulkMail = async (req, res) => {
//   try {
//     if (!req.body.emails || !req.body.subject || !req.body.content) {
//       return res.status(400).send("Every field is required");
//     }

//     const { emails, subject, content} = req.body;

//     console.log(req.body)
//   } catch (error) {
//     console.error(error);
//     res.status(500).render('error/500'); // Render a '500' error page for server errors
//   }
// };


exports.getApplicationUpdate = async (req, res) => {
  try {
    const existingSetting = await Setting.find({});
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }
    res.render("admin/update", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch {
    res.status(404).json({ message: "Page Not Found" });
  }
};

exports.getServerstats = async (req, res) => {
  try {
    const nodeVersion = process.version;

    const publicFolderPath = "./public";
    let publicFolderStatus = "";

    try {
      await fs.promises.access(
        publicFolderPath,
        fs.constants.R_OK | fs.constants.W_OK
      );
      publicFolderStatus = "Read and write permissions";
    } catch (err) {
      publicFolderStatus = "No read and write permissions";
    }

    const envPath = "./.env";
    let envStatus = "";

    try {
      await fs.promises.access(envPath, fs.constants.R_OK | fs.constants.W_OK);
      envStatus = "Read and write permissions";
    } catch (err) {
      envStatus = "No read and write permissions";
    }

    const controllerPath = "./controller";
    let controllerStatus = "";

    try {
      await fs.promises.access(
        controllerPath,
        fs.constants.R_OK | fs.constants.W_OK
      );
      controllerStatus = "Read and write permissions";
    } catch (err) {
      controllerStatus = "No read and write permissions";
    }

    const viewsPath = "./views";
    let viewsStatus = "";

    try {
      await fs.promises.access(
        viewsPath,
        fs.constants.R_OK | fs.constants.W_OK
      );
      viewsStatus = "Read and write permissions";
    } catch (err) {
      viewsStatus = "No read and write permissions";
    }

    const existingSetting = await Setting.find({});

    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).render("errors/401", { layout: "errorLayout" });
    }

    res.render("admin/settings/server-status", {
      layout: adminLayout,
      nodeVersion,
      currentUser,
      existingSetting,
      publicFolderStatus,
      envStatus,
      controllerStatus,
      viewsStatus,
    });
  } catch (err) {
    // Handle any errors and render a 404 page
    res.status(404).json({ message: "Page Not Found" });
  }
};
exports.getFacebookChat = async (req, res) => {
  try {

    const existingSetting = await Setting.find({});

    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).render("errors/401", { layout: "errorLayout" });
    }

    res.render("admin/settings/facebook-chat", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (err) {
    // Handle any errors and render a 404 page
    res.status(404).json({ message: "Page Not Found" });
  }
};
exports.getFacebookComment = async (req, res) => {
  try {

    const existingSetting = await Setting.find({});

    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).render("errors/401", { layout: "errorLayout" });
    }

    res.render("admin/settings/facebook-comment", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (err) {
    // Handle any errors and render a 404 page
    res.status(404).json({ message: "Page Not Found" });
  }
};

exports.getGoogleAnalytics = async (req, res) => {
  try {

    const existingSetting = await Setting.find({});

    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).render("errors/401", { layout: "errorLayout" });
    }

    res.render("admin/settings/google-analytics", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (err) {
    // Handle any errors and render a 404 page
    res.status(404).json({ message: "Page Not Found" });
  }
};

exports.getGoogleRecaptcha = async (req, res) => {
  try {

    const existingSetting = await Setting.find({});

    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).render("errors/401", { layout: "errorLayout" });
    }

    res.render("admin/settings/google-recaptcha", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (err) {
    // Handle any errors and render a 404 page
    res.status(404).json({ message: "Page Not Found" });
  }
};

exports.getGoogleMap = async (req, res) => {
  try {

    const existingSetting = await Setting.find({});

    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).render("errors/401", { layout: "errorLayout" });
    }

    res.render("admin/settings/google-map", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (err) {
    // Handle any errors and render a 404 page
    res.status(404).json({ message: "Page Not Found" });
  }
};
exports.getGoogleFirebase = async (req, res) => {
  try {

    const existingSetting = await Setting.find({});

    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).render("errors/401", { layout: "errorLayout" });
    }

    res.render("admin/settings/google-firebase", {
      layout: adminLayout,
      currentUser,
      existingSetting,
    });
  } catch (err) {
    // Handle any errors and render a 404 page
    res.status(404).json({ message: "Page Not Found" });
  }
};
exports.getAdminTagCreate = async (req, res) => {
  try {
    const categories = await Category.find();
    const currentUser = req.user;

    if (!currentUser) {
      // If userId is not available, handle it appropriately (send a response, redirect, etc.)
      return res.status(401).render("errors/401", { layout: errorLayout });
    }
    res.render("admin/tag-create", {
      layout: adminLayout,
      currentUser,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postcreateTag = async (req, res) => {
  try {
    const { name } = req.body;

    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return res
        .status(400)
        .json({ error: "Tag with this name already exists" });
    }

    const newTag = await Tag.create({ name });

    res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateAdminTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    tag.name = name;
    await tag.save();

    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteAdminTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    await tag.remove();

    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
