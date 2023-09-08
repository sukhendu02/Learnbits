const mongoose =require('mongoose')

const express = require("express");
const app = express();

const javaSchema = new mongoose.Schema({
    question: String,
    topic: [String],
    answer: String,
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const java = mongoose.model('java', javaSchema);
 module.exports=java;