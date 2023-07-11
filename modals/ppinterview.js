const mongoose =require('mongoose')

const express = require("express");
const app = express();

const PPinterviewSchema = new mongoose.Schema({
    question: String,
    topic: String,
    answer: String,
    level: String,
    type: String,
    date:{type:Date,default:Date.now

    }
    
  })

 const PPinterview = mongoose.model('PPinterview', PPinterviewSchema);
 module.exports=PPinterview;