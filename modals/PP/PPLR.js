const mongoose =require('mongoose')

const express = require("express");
const app = express();

const PPLRSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const PPLR = mongoose.model('PPLR', PPLRSchema);
 module.exports=PPLR;