const mongoose =require('mongoose')

const express = require("express");
const app = express();

const bookSchema = new mongoose.Schema({
    bookname: String,
    Auther: String,
    tags: String,
    file:String,
    // coverimg:String,
    date:{type:Date,default:Date.now
    }
    
    
  })

 const book = mongoose.model('book',bookSchema);
 module.exports=book;
