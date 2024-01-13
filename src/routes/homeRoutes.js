const express = require('express');
const home = express.Router();
const homeController = require('../controller/homeController');
const setupCheckMiddleware = require('../middleware/setupCheck');
//const checkIfAuthenticated = require('../middleware/isloggedin')
const preventLoginAccess = require('../middleware/preventLoginAccess');



home.get('/',  homeController.getIndex);
home.get('/hot-posts', setupCheckMiddleware, homeController.hotPosts);
home.get('/blog',  homeController.getAllBlogPost);
home.get('/Contact', setupCheckMiddleware, homeController.getContact);
home.post('/contact', setupCheckMiddleware, homeController.postContact);
home.get('/admin/login',preventLoginAccess,  setupCheckMiddleware, homeController.login);
home.post('/admin/login', setupCheckMiddleware, homeController.postLogin);
home.get('/xman/destroy/logout', homeController.logout)



module.exports = home;
