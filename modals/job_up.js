const mongoose =require('mongoose')

const express = require("express");
const app = express();

const job_updatesSchema = new mongoose.Schema({
    title: String,
    Company: String,
    Job_profile: String,
    Experience:String,
    Last_date:String,
    job_location:String,
    job_type:String,
    job_details:String,
    company_logo:String,
    CTC:String,
    apply_link:String,
    date:{type:Date,default:Date.now
    }
    
  })

 const job_updates = mongoose.model('job_updates', job_updatesSchema);
 module.exports=job_updates;