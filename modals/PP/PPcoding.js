const mongoose =require('mongoose')

const express = require("express");
const app = express();

const CommentSchema = new mongoose.Schema({
  content: String,
  // author: ,
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
});

const ReplySchema = new mongoose.Schema({
  content: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

const PPcodingSchema = new mongoose.Schema({
    question: String,
    topic: [String],
    answer: String,
    company_tags: [String],
    comment: [CommentSchema],
    
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const PPcoding = mongoose.model('PPcoding', PPcodingSchema);
 module.exports=PPcoding;
