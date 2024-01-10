const express = require('express');
const admin = express.Router();
const adminController = require('../controller/adminController');

admin.get('/', adminController.getAdminIndex);
admin.get('/admin/blog', adminController.getAdminBlog);
admin.get('/admin/blog/create', adminController.getAdminBlogCreate);
admin.post('/admin/blog/create', adminController.postAdminBlogCreate);
admin.get('/admin/blog-category', adminController.getAdminCategory);
admin.get('/admin/blog-category/create', adminController.createAdminCategory);
admin.get('/admin/blog/:id/edit', adminController.getAdminBlogEdit);
admin.delete('/admin/blog/destroy/:id', adminController.deleteAdminBlogPost);
admin.post('/admin/blog/edit-post/:id/',  adminController.postAdminBlogEdit);
admin.post('/admin/blog-category', adminController.postAdminCategory);
admin.get('/admin/website/header', adminController.getAdminSettingHeader);
admin.get('/admin/website/footer', adminController.getAdminSettingFooter);
admin.get('/admin/website/appearance', adminController.getAdminSettingAppearance);
admin.get('/admin/activation', adminController.getAdminSettingFeature);
admin.get('/admin/social-login', adminController.getAdminSettinglogin);
admin.get('/admin/smtp-settings', adminController.getAdminSettingSmtp);
admin.post('/admin/env_key_update', adminController.postAdminEnvSetting);
admin.post('/admin/business-settings/update', adminController.updateAdminSettingHeader)

//admin.get('/admin/blog-category/create', adminController.getAdminCategoryCreate);
// category.get('/:id', categoryController.getCategoryById);
// category.post('/', categoryController.createCategory);
// category.put('/:id', categoryController.updateCategory);
// category.delete('/:id', categoryController.deleteCategory);

module.exports = admin;
