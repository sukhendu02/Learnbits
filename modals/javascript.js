const mongoose =require('mongoose')

const express = require("express");
const app = express();

const javascriptSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const javascript = mongoose.model('javascript', javascriptSchema);
 module.exports=javascript;;