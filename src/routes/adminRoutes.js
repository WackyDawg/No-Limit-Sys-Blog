const express = require('express');
const admin = express.Router();
const adminController = require('../controller/adminController');

const { isAuthenticated } = require('../middleware/authMiddleware')
const setupCheckMiddleware = require('../middleware/setupCheck');



admin.get('/', isAuthenticated, setupCheckMiddleware,  adminController.getAdminIndex);
admin.get('/blog', isAuthenticated, setupCheckMiddleware,  adminController.getAdminBlog);
admin.get('/blog/create', isAuthenticated, setupCheckMiddleware,  adminController.getAdminBlogCreate);
admin.post('/blog/create',isAuthenticated,setupCheckMiddleware,  adminController.postAdminBlogCreate);
admin.get('/blog-category', isAuthenticated,setupCheckMiddleware,  adminController.getAdminCategory);
admin.get('/blog-category/create',isAuthenticated, setupCheckMiddleware,  adminController.createAdminCategory);
admin.get('/blog/:id/edit', isAuthenticated,setupCheckMiddleware,  adminController.getAdminBlogEdit);
admin.delete('/blog/destroy/:id',isAuthenticated, setupCheckMiddleware,  adminController.deleteAdminBlogPost);
admin.post('/blog/edit-post/:id/',isAuthenticated, setupCheckMiddleware,  adminController.postAdminBlogEdit);
admin.post('/blog-category',isAuthenticated, setupCheckMiddleware,  adminController.postAdminCategory);
admin.get('/website/header',isAuthenticated, setupCheckMiddleware,  adminController.getAdminSettingHeader);
admin.get('/website/footer',isAuthenticated, setupCheckMiddleware,  adminController.getAdminSettingFooter);
admin.get('/website/appearance',isAuthenticated, setupCheckMiddleware,  adminController.getAdminSettingAppearance);
admin.get('/activation',isAuthenticated, setupCheckMiddleware,  adminController.getAdminSettingFeature);
admin.get('/social-login',isAuthenticated,setupCheckMiddleware,  adminController.getAdminSettinglogin);
admin.get('/smtp-settings',isAuthenticated, setupCheckMiddleware,  adminController.getAdminSettingSmtp);
admin.post('/env_key_update', isAuthenticated,setupCheckMiddleware,  adminController.postAdminEnvSetting);
admin.post('/business-settings/update', isAuthenticated, setupCheckMiddleware,  adminController.updateAdminSettingHeader);
admin.get('/profile',isAuthenticated, setupCheckMiddleware,  adminController.getAdminProfile);
admin.post('/profile-update', isAuthenticated, setupCheckMiddleware, adminController.updateAdminProfile)
admin.get('/system/update', isAuthenticated, setupCheckMiddleware, adminController.getApplicationUpdate)
admin.get('/system/server-status', isAuthenticated, setupCheckMiddleware, adminController.getServerstats)

module.exports = admin;
