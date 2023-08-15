const mongoose =require('mongoose')

const express = require("express");
const app = express();

const CppSchema = new mongoose.Schema({
  question: String,
  topic: String,
  answer: String,
  level: String,
  date:{type:Date,default:Date.now

  }
  
})

const Cpp = mongoose.model('Cpp', CppSchema);
module.exports=Cpp;