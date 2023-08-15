const mongoose =require('mongoose')

const express = require("express");
const app = express();

const CSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const C = mongoose.model('C', CSchema);
 module.exports=C;