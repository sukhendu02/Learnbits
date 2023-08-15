const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var fs = require('fs');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const session = require('express-session');


const flash = require('express-flash');
app.use(flash());

app.use(session({
    secret: process.env.SESSIONFLASH,
    resave: false,
    saveUninitialized: true
  }));
const cookieParser = require('cookie-parser')
app.use(cookieParser());


//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


const adminuser = require('./modals/adminuser')
const adminauth =require('./middleware/adminauth')

const contestschema = require('./modals/contest')


module.exports = function (app) {
  
    }