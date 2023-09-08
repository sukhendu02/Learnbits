const mongoose =require('mongoose')

const express = require("express");
const app = express();

const PythonSchema = new mongoose.Schema({
    question: String,
    topic: [String],
    answer: String,
    level: String,
    date:{type:Date,default:Date.now
    }
    
  })

 const Python = mongoose.model('Python', PythonSchema);
 module.exports=Python;