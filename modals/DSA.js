const mongoose =require('mongoose')

const express = require("express");
const app = express();


const DSASchema = new mongoose.Schema({
    question: String,
    topic: [String],
    answer: String,
    company_tags: [String],
  
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const DSA = mongoose.model('DSA', DSASchema);
 module.exports=DSA;
