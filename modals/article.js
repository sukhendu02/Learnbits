const mongoose =require('mongoose')

const express = require("express");
const app = express();

const articleSchema = new mongoose.Schema({
    articleTitle: String,
    auther: String,
    type: String,
    topic:String,
    catagory:String,
    subCatagory:String,
    status:String,
    date:{type:Date,default:Date.now
    }
    
    
  })

 const article = mongoose.model('article',articleSchema);
 module.exports=article;
