const mongoose = require('mongoose');
const slugify = require('slugify');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category' 
    },
    slug: {
        type: String,
    },
    banners: { 
        type: String,
        required: true, 
    },
    short_description: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: [String], 
        default: [],
    },
    isEditorsChoice: {
        type: Boolean,
        default: false,
    },
    meta_title: {
        type: String,
        required: true,
    },
    meta_img: { 
        type: [String], 
        default: [] 
    },
    meta_description: {
        type: String,
        required: true,
    },
    meta_keywords: {
        type: String,
        required: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

PostSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

module.exports = mongoose.model('Post', PostSchema);
