const mongoose =require('mongoose')

const express = require("express");
const app = express();

const interview_expSchema = new mongoose.Schema({
    compname: String,
    position: String,
    date_of_int: Date,
    int_exp: String,
    // type: String,
    userdata:{type:Object},
    userid:String,
    username:String,
    // like:{type:S}
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      // ref: 'User'
    }],
    date:{type:Date,default:Date.now

    }
    
  })

 const interview_exp = mongoose.model('interview_exp', interview_expSchema);
 module.exports=interview_exp;