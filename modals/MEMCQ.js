const mongoose =require('mongoose')

const express = require("express");
const app = express();

const MEMCQSchema = new mongoose.Schema({
    questionmcq: String,
    topic: String,
    subtopic:String,
    option1:String,
    option2:String,
    option3:String,
    option4:String,
    answer: String,
  
    date:{type:Date,default:Date.now
    }
    
  })

 const MEMCQ = mongoose.model('MEMCQ', MEMCQSchema);
 module.exports=MEMCQ;