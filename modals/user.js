const mongoose =require('mongoose')

const express = require("express");
const app = express();


const path = require("path");
const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
   
    fullname: String,
    email: String,
    // phone: Number,
    password:String,
    cpassword:String,
    
    //NEW EDITS 
    firstName:String,
    lastName:String,
    phone:String,
    bio:String,
    title:String,


    currentEduStatus:String,

   schoolDetails: {
    schoolName: String,
    grade: String,
},

collegeDetails: {
    collegeName: String,
    degree: String,
    specialization: String,
    passingYear: Number,
},


workDetails: {
    companyName: String,
    position: String,
},
 // Links
socialLinks:{
    LinkedinLink:String,
    InstagramLink:String,
    GithubLink:String,
    myLink:String,
},
  
   coins: {
    type: Number,
    default: 0,
  },
  

    // CUSTOM
    Date:{ type:Date,
        default:Date.now
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]

    

})

userSchema.pre('save', async function (next) {
  
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12)
       
    }
next();
    
})
userSchema.methods.generateAuthToken = async function(){
    try{
        let token = jwt.sign({_id:this._id}, process.env.SECRET_KEY)
       this.tokens = this.tokens.concat({token:token})
       
       await this.save();
       return token;
    }
    catch{
        res.render('error.hbs')
    }
}

const user = mongoose.model('user', userSchema);
module.exports = user;
