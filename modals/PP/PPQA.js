const mongoose =require('mongoose')

const express = require("express");
const app = express();
const PPQASchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const PPQA= mongoose.model('PPQA', PPQASchema);
 module.exports=PPQA;