const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
    site_name: {
          type: String,
          required: false,
    },
    website_name: {
        type: String,
        required: false,
    },
    site_motto: {
        type: String,
        required: false,
    },
    site_icon: { 
        type: [String], 
        default: [] 
    },
    system_logo: { 
        type: [String], 
        default: [] 
    },
    base_color: {
        type: String,
        required: false,
    },
    base_hov_color: {
        type: String,
        required: false,
    },
    secondary_base_color: {
        type: String,
        required: false,
    },
    secondary_base_hov_color: {
        type: String,
        required: false,
    },
    meta_title: {
        type: String,
        required: false,
    },
    meta_description: {
        type: String,
        required: false,
    },
    meta_keywords: {
        type: String,
        required: false,
    },
    meta_image: { 
        type: [String], 
        default: [] 
    },
    cookies_description: {
        type: String,
        required: false,
    },
    show_cookies_agreement: {
        type: Boolean,
    },
    show_website_popup: {
        type: Boolean,
    },
    popup_description: {
       type: String,
       required: false,
    },
    show_subscribe_form: {
      type: Boolean,
      required: false,
    },
    header_script: {
        type: String,
        required: false,
    },
    footer_script: {
        type: String,
        required: false,
    }, 
    headerlogo: { 
        type: [String], 
        default: [] 
    },
    footerlogo: { 
        type: [String], 
        default: [] 
    },
    header_sticky: {
        type: Boolean,
    },
    show_social_links: {
      type: Boolean,
    },
    facebook_link: {
        type: String,
        required: false,
    },
    twitter_link: {
        type: String,
        required: false,      
    },
    instagram_link: {
        type: String,
        required: false,
    },
    youtube_link: {
        type: String,
        required: false,
    },
    linkedin_link: {
        type: String,
        required: false,
    },
    phonenumber: {
        type: String,
        required: false,
    },
    contact_phone: {
        type: String,
        required: false,
    },
    contact_address: {
        type: String,
        required: false,
    },
    frontend_copyright_text: {
        type: String,
        required: false,
    },
    contact_email: {
        type: String,
        required: false,
    },
    copywritetext: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    play_store_link: {
        type: String,
        required: false,
    },
    app_store_link: {
        type: String,
        required: false,
    },
    logo: { 
        type: [String], 
        default: [] 
    }
});

// Remove the slugify code
// SettingsSchema.pre('save', function (next) {
//     this.slug = slugify(this.title, { lower: true });
//     next();
// });

module.exports = mongoose.model('Settings', SettingsSchema);
