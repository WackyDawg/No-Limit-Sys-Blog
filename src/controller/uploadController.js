

const express = require('express');
const router = express.Router();
const trackSetupProgress = require('../middleware/trackSetupProgress');
const Setting = require('../models/blogSettingsModel')
const Category = require('../models/categoryModel');
const Post = require('../models/postModel');

const User = require('../models/userModel');
const connectDB = require('../config/db'); // Add this require

const path = require('path')
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

exports.upload = async (req, res) => {
    try {
      console.log('Import data route triggered');
  
      // Read data from data.json file
      const jsonDataPath = path.join(__dirname, '../data.json');
      const jsonData1 = fs.readFileSync(jsonDataPath, 'utf8');
      const settings = JSON.parse(jsonData1);
  
      // Connect to MongoDB
      const db = await connectDB();
  
      // Insert data into MongoDB
      const setting = db.collection('settings');
  
      // Insert the documents into the "biscuit2" collection
      const result1 = await setting.insertMany(settings);
      console.log(`${result1.insertedCount} documents from data.json inserted into the biscuit2 collection.`);
  
      // Close MongoDB connection (close it after all operations are done)
      await db.client.close();
      trackSetupProgress(5);
  
      res.redirect('/step5');
    } catch (error) {
      console.error('Error importing data:', error);
  res.status(500).render('errors/500')
    }
  }