const mongoose =require('mongoose')

const express = require("express");
const app = express();

const contactSchema = new mongoose.Schema({
    con_name: String,
    con_email: String,
    subject: String,
    message:String,
  
    date:{type:Date,default:Date.now
    }
    
  })

 const contact = mongoose.model('contact', contactSchema);
 module.exports=contact;