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
admin.get('/blog-category/:id/edit', isAuthenticated,setupCheckMiddleware,  adminController.getAdminCategoryEdit);
admin.post('/blog-category/:id/', isAuthenticated,setupCheckMiddleware,  adminController.editAdminCategory);
admin.delete('/blog-category/destroy/:id/', isAuthenticated,setupCheckMiddleware,  adminController.deleteAdminBlogCategory);
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
admin.get('/support_ticket', isAuthenticated, setupCheckMiddleware, adminController.getAdminSupportTickets)
admin.get('/newsletter', isAuthenticated, setupCheckMiddleware, adminController.getNewsletter)
admin.post('/newsletter/send', isAuthenticated, setupCheckMiddleware, adminController.sendBulkMail)
admin.get('/subscribers', isAuthenticated, setupCheckMiddleware, adminController.getAllSubscribers)
admin.delete('/subscribers/destroy/:id', isAuthenticated, setupCheckMiddleware, adminController.deleteSubscriberById)
admin.get('/facebook-chat', isAuthenticated, setupCheckMiddleware, adminController.getFacebookChat)
admin.get('/facebook-comment', isAuthenticated, setupCheckMiddleware, adminController.getFacebookComment)
admin.get('/google-analytics', isAuthenticated, setupCheckMiddleware, adminController.getGoogleAnalytics)
admin.get('/google-recaptcha', isAuthenticated, setupCheckMiddleware, adminController.getGoogleRecaptcha)
admin.get('/google-map', isAuthenticated, setupCheckMiddleware, adminController.getGoogleMap)
admin.get('/google-firebase', isAuthenticated, setupCheckMiddleware, adminController.getGoogleFirebase)
admin.get('/staffs', isAuthenticated, setupCheckMiddleware, adminController.getAdminStaff)
admin.get('/staffs/create', isAuthenticated, setupCheckMiddleware, adminController.getAdminCreate)
admin.post('/staffs/create', isAuthenticated, setupCheckMiddleware, adminController.postcreateStaffs)
admin.get('/roles', isAuthenticated, setupCheckMiddleware, adminController.getAdminRole)
admin.get('/roles/create', isAuthenticated, setupCheckMiddleware, adminController.getAdminRoleCreate)
admin.post('/roles', isAuthenticated, setupCheckMiddleware, adminController.postAdminRoleCreate)


module.exports = admin;
