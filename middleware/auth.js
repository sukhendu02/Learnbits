
const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
// const mongoose = require('mongoose');
// const PPinterview = require('./modals/ppinterview');
// const interview_exp = require('./modals/interview_exp');
const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const cookieParser = require('cookie-parser')


const user = require('../modals/user')


const auth = async (req,res,next)=>{
    try{
        
        const token = req.cookies.jwt;
        // console.log(token)
        const verifyUser =jwt.verify(token,process.env.SECRET_KEY);
        // console.log(verifyUser)
        

        const data = await user.findOne({_id:verifyUser._id,"tokens.token":token})
       req.token = token;
       req.data = data;
    //    console.log(data.email)
       
       
        next();

    }
    catch{
        req.session.returnTo = req.originalUrl; 

        res.status(401).render('login.hbs')
    }
}

module.exports = auth;