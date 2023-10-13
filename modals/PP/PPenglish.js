const mongoose =require('mongoose')

const express = require("express");
const app = express();

const PPenglishSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const PPenglish = mongoose.model('PPenglish', PPenglishSchema);
 module.exports=PPenglish;