// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  blog_title: {
    type: String,
    required: true,
    trim: true,
  },
  blog_brief: {
    type: String,
    required: true,
    trim: true,
  },
  blog_category: {
    type: String,
    required: true,
    // enum: ['Programming', 'AI', 'ML', 'Interview Prep', 'Other'],
  },
  blog_tags: {
    type: [String],
    default: [],
  },
  blog_post: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    // enum: ['in review', 'approved', 'rejected'],
    default: 'In-review',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    // type: Object,
     type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    // required: true,
  }
});

module.exports = mongoose.model("Blog", blogSchema);
