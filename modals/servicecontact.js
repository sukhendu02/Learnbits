const mongoose =require('mongoose')

const express = require("express");
const app = express();

const servicecontactSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    mobile: String,
    select: String,
    brief:String,
    date:{type:Date,default:Date.now
    }
  })

 const servicecontact = mongoose.model('servicecontact', servicecontactSchema);
 module.exports=servicecontact;