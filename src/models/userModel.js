const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    unique: true,
  },
  avatar: { 
    type: [String], 
    default: [] 
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
  },
  readHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
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
  tiktok_link: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
