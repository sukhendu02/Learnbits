const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
// const mongoose = require('mongoose');
// const PPinterview = require('./modals/ppinterview');
// const interview_exp = require('./modals/interview_exp');
const bodyParser = require("body-parser");
// const { count } = require('console');

// const adminauth = require('./adminauth')

//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())


module.exports = function (app) {
 
app.get('/contest',(req,res)=>{
    res.render('./contest/contest.hbs')
})


}