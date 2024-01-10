const express = require('express');
const upload = express.Router();
const uploadController = require('../controller/uploadController');

upload.post('/upload', uploadController.upload);

module.exports = upload;