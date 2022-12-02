const mongoose =require('mongoose')

const express = require("express");
const app = express();

const newsletterSchema = new mongoose.Schema({
    nl_email: String,
   
    date:{type:Date,default:Date.now()
    }
    
  })

 const newsletter = mongoose.model('newsletter', newsletterSchema);
 module.exports=newsletter;