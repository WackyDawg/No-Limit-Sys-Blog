const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    banner: { 
        type: [String], 
        default: [] 
    },
    short_description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;