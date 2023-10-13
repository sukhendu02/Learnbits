const mongoose =require('mongoose')

const express = require("express");
const app = express();

const PPcodingSchema = new mongoose.Schema({
    question: String,
    topic: [String],
    answer: String,
    company_tags: [String],
    // : [String],
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const PPcoding = mongoose.model('PPcoding', PPcodingSchema);
 module.exports=PPcoding;
