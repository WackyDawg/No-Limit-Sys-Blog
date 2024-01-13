const express = require("express");
const router = express.Router();
const trackSetupProgress = require("../middleware/trackSetupProgress");
const Setting = require("../models/blogSettingsModel");
const Category = require("../models/categoryModel");
const Post = require("../models/postModel");

const setupCheckMiddleware = require("../middleware/setupCheck");
const User = require("../models/userModel");
const connectDB = require("../config/db"); // Add this require

const path = require("path");
const methodOverride = require("method-override");
const expressLayout = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const { promisify } = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

connectDB();

const setupLayout = path.join(__dirname, "../views/layouts/setup");
const errorLayout = path.join(__dirname, "../views/layouts/error");

const getCurrentStep = () => {
  // Implement this function based on how you track the setup progress
  // For example, read from a file or database
  const stepFilePath = "step.txt"; // Replace with the actual file reference

  if (fs.existsSync(stepFilePath)) {
    // Read the current step from the file
    const currentStep = parseInt(fs.readFileSync(stepFilePath, "utf-8"), 10);
    return currentStep;
  } else {
    // If the file doesn't exist, assume step 0
    return 0;
  }
};

exports.step0 = async (req, res) => {
  try {
    const nodeVersion = process.version;
    const isInstalled = fs.existsSync(".env") && fs.existsSync("installed.txt");
    const existingSetting = await Setting.find({});
    const allPosts = await Post.find().populate("category", "name");

    if (isInstalled) {
      return res
        .status(404)
        .render("errors/404", {
          layout: errorLayout,
          existingSetting,
          posts: allPosts,
        });
    }

    res.render("installation/index", { layout: setupLayout });
  } catch (error) {
    res.status(500).render("errors/500");
  }
};

exports.Step1 = async (req, res) => {
  try {
    const nodeVersion = process.version;
    const isInstalled = fs.existsSync(".env") && fs.existsSync("installed.txt");
    const existingSetting = await Setting.find({});
    const allPosts = await Post.find().populate("category", "name");

    if (isInstalled) {
      return res
        .status(404)
        .render("errors/404", {
          layout: errorLayout,
          existingSetting,
          posts: allPosts,
        });
    }
    res.render("installation/step1", { nodeVersion, layout: setupLayout });
  } catch (error) {
    res.status(500).render("errors/500");
  }
};

exports.Step2 = async (req, res) => {
  try {
    const isInstalled = fs.existsSync(".env") && fs.existsSync("installed.txt");
    const existingSetting = await Setting.find({});
    const allPosts = await Post.find().populate("category", "name");

    if (isInstalled) {
      return res
        .status(404)
        .render("errors/404", {
          layout: errorLayout,
          existingSetting,
          posts: allPosts,
        });
    }
    res.render("installation/step2", { layout: setupLayout });
  } catch (error) {
    res.status(500).render("errors/500");
  }
};

exports.Step3 = async (req, res) => {
  try {
    const isInstalled = fs.existsSync(".env") && fs.existsSync("installed.txt");
    const existingSetting = await Setting.find({});
    const allPosts = await Post.find().populate("category", "name");

    if (isInstalled) {
      return res
        .status(404)
        .render("errors/404", {
          layout: errorLayout,
          existingSetting,
          posts: allPosts,
        });
    }
    res.render("installation/step3", { layout: setupLayout });
  } catch (error) {
    res.status(500).render("errors/500");
  }
};

exports.postStep3 = async (req, res) => {
  try {
    const { mongodb_username, mongodb_password, mongodb_database } = req.body;

    // Read the existing content of the .env file
    const envFilePath = ".env";
    const existingContent = await readFileAsync(envFilePath, "utf-8");

    // Update the relevant lines in the existing content
    const updatedContent = existingContent
      .replace(/^MONGODB_USERNAME=.*/m, `MONGODB_USERNAME=${mongodb_username}`)
      .replace(/^MONGODB_PASSWORD=.*/m, `MONGODB_PASSWORD=${mongodb_password}`)
      .replace(/^MONGODB_DATABASE=.*/m, `MONGODB_DATABASE=${mongodb_database}`);

    // Save the updated content back to the .env file
    await writeFileAsync(envFilePath, updatedContent, { encoding: "utf-8" });
    trackSetupProgress(4);
    res.redirect("/step4");
  } catch (error) {
    console.error(error);
    res.status(500).render("errors/500");
  }
};

exports.Step4 = async (req, res) => {
  try {
    const isInstalled = fs.existsSync(".env") && fs.existsSync("installed.txt");
    const existingSetting = await Setting.find({});
    const allPosts = await Post.find().populate("category", "name");

    if (isInstalled) {
      return res
        .status(404)
        .render("errors/404", {
          layout: errorLayout,
          existingSetting,
          posts: allPosts,
        });
    }
    res.render("installation/step4", { layout: setupLayout });
  } catch (error) {
    res.status(500).render("errors/500");
  }
};

exports.postStep4 = async (req, res) => {
  try {
    console.log("Import data route triggered");

    // Read data from data.json file
    const jsonDataPath = path.join(__dirname, "../imports/settings.json");
    const jsonDataPath2 = path.join(__dirname, "../imports/categories.json");
    const jsonDataPath3 = path.join(__dirname, "../imports/contacts.json");
    const jsonDataPath4 = path.join(__dirname, "../imports/posts.json");

    const jsonData1 = fs.readFileSync(jsonDataPath, "utf8");
    const jsonData2 = fs.readFileSync(jsonDataPath2, "utf8");
    const jsonData3 = fs.readFileSync(jsonDataPath3, "utf8");
    const jsonData4 = fs.readFileSync(jsonDataPath4, "utf8");

    if (
      jsonData1.trim() === "" ||
      jsonData2.trim() === "" ||
      jsonData3.trim() === "" ||
      jsonData4.trim() === ""
    ) {
      console.log("One or more JSON files are empty. Aborting import.");
      return res.status(500).send("Error: One or more JSON files are empty.");
    }

    const settings = JSON.parse(jsonData1);
    const categories = JSON.parse(jsonData2);
    const contacts = JSON.parse(jsonData3);
    const posts = JSON.parse(jsonData4);

    // Connect to MongoDB
    const db = await connectDB();

    // Insert data into MongoDB
    const setting = db.collection("settings");
    const category = db.collection("categories");
    const contact = db.collection("contacts");
    const post = db.collection("posts");

    // Insert the documents into the "biscuit2" collection
    const result1 = await setting.insertMany(settings);
    const result2 = await category.insertMany(categories);
    const result3 = await contact.insertMany(contacts);
    const result4 = await post.insertMany(posts);

    console.log(
      `${result1.insertedCount} documents from data.json inserted into the settings collection.`
    );
    console.log(
      `${result2.insertedCount} documents from data.json inserted into the categories collection.`
    );
    console.log(
      `${result3.insertedCount} documents from data.json inserted into the contact collection.`
    );
    console.log(
      `${result4.insertedCount} documents from data.json inserted into the post collection.`
    );

    // Close MongoDB connection (close it after all operations are done)
    await db.client.close();
    trackSetupProgress(5);

    res.redirect("/step5");
  } catch (error) {
    console.error("Error importing data:", error);
  }
};

exports.Step5 = async (req, res) => {
  try {
    const isInstalled = fs.existsSync(".env") && fs.existsSync("installed.txt");

    if (isInstalled) {
      return res.status(404).render("errors/404", { layout: errorLayout });
    }

    // Check the current step in the setup progress
    const currentStep = getCurrentStep(); // Implement this function based on your setup progress tracking

    if (currentStep === 5) {
      // If the current step is 5, render the Step 5 page
      return res.render("installation/step5", { layout: setupLayout });
    } else {
      // If the current step is not 5, return a 405 Method Not Allowed error
      res.status(405).render("errors/405", { layout: errorLayout });
    }
  } catch (error) {
    res.status(500).render("errors/500");
  }
};

exports.postStep5 = async (req, res) => {
  try {
    const { admin_name, admin_email, admin_password } = req.body;

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(admin_password, 10);

    try {
      const db = await connectDB();
      const User = db.collection("users");

      // Check if there is already an admin in the database
      const existingAdmin = await User.findOne({ role: "admin" });

      if (existingAdmin) {
        // If an admin already exists, create a regular user
        const user = await User.insertOne({
          name: admin_name,
          email: admin_email,
          password: hashedPassword,
          role: "user",
        });
        trackSetupProgress(6);
        fs.writeFileSync("installed.txt", "Installation complete");

        // Send a success response and redirect
        return res.status(201).redirect("/blog");
      } else {
        // If no admin exists, create the admin
        const admin = await User.insertOne({
          name: admin_name,
          email: admin_email,
          password: hashedPassword,
          role: "admin",
        });
        trackSetupProgress(6);
        fs.writeFileSync("installed.txt", "Installation complete");

        // Send a success response and redirect
        return res.status(201).redirect("/blog");
      }
    } catch (error) {
      // Handle database error
      console.error("Error saving user to the database:", error);
      res.status(500).render("errors/500");
    }
  } catch (error) {
    // Handle other errors, e.g., validation errors
    console.error("Error registering user:", error);
    return res.status(400).render("errors/400");
  }
};


