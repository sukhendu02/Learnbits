const hbs = require('hbs');
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const { count } = require('console');
const session = require('express-session');

// const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const cookieParser = require('cookie-parser')

app.use(cookieParser());

const auth = require('../middleware/auth')
const adminauth = require('../middleware/adminauth')

//  BODY PARSER
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())







const C =require('../modals/C')
const Cpp =require('../modals/Cpp')
const Python =require('../modals/Python')
const java =require('../modals/java')
const javascript =require('../modals/javascript')

const PPinterview = require('../modals/ppinterview.js')
const PPQA = require('../modals/PP/PPQA')
const PPLR = require('../modals/PP/PPLR')
const PPenglish = require('../modals/PP/PPenglish')
// const DSA = require('../modals/PP/DSA')
const DSA = require('../modals/dsa.js')







module.exports = function (app) {
   
    app.get('/Placement-Prepration/Quantitative-Aptitude', async (req, res) => {
        const PPQAs = await PPQA.find({})
        .sort({date:-1})
         res.render('ques-list.hbs',{
             PPQAs,PPQA:true
         })
     });
     app.get('/Placement-Prepration/Logical-reasoning', async (req, res) => {
        const PPLRs = await PPLR.find({})
        .sort({date:-1})
         res.render('ques-list.hbs',{
             PPLRs,PPLR:true
         })
     });
     app.get('/Placement-Prepration/English', async (req, res) => {
        const PPenglishs = await PPenglish.find({})
        .sort({date:-1})
         res.render('ques-list.hbs',{
             PPenglishs,PPenglish:true
         })
     });
     app.get('/Data-Structure-and-algorithms/questions', async (req, res) => {
        const {page=1,limit=15}=req.query;
        var nextp=parseInt(page)+1;
        var prevp=parseInt(page)-1;
        if (nextp==2){
            var firstpage=nextp
        }
        var hasnext =1;
        const lastpage=await DSA.countDocuments()/limit
        if(lastpage>page){
             hasnext=null;
        }
    
        const DSAs = await DSA.find({}).limit(limit * 1).skip((page-1)*limit)
        .sort({date:-1})

       
         res.render('ques-list.hbs',{
             DSAs,DSA:true,prevp,firstpage, hasnext,nextp,
         })
     });
     app.get('/interview-prep', async (req, res) => {
       
         res.render('interview_prep.hbs',{
            //  PPinterviews,PPinterview:true
         })
     });

 




    //  //////////////////
    
app.get('/Placement-Prepration/Quantitative-Aptitude/:id/:question', async (req, res) => {
    const PPQAs = await PPQA.findById(req.params.id)
    res.render('question.hbs', {
        PPQAs
    })
});

app.get('/Placement-Prepration/Logical-reasoning/:id/:question', async (req, res) => {
    const PPLRs = await PPLR.findById(req.params.id)
    res.render('question.hbs', {
        PPLRs
    })
});
app.get('/Placement-Prepration/English/:id/:question', async (req, res) => {
    const PPenglishs = await PPenglish.findById(req.params.id)
    res.render('question.hbs', {
        PPenglishs
    })
});
app.get('/Data-Structure-and-algorithms/questions/:id/:question', async (req, res) => {
    const DSAs = await DSA.findById(req.params.id)
    const rel_DSA = await DSA.find({}).limit(5)
    .sort({date:-1})

    // console.log(rel_DSA)
    res.render('question.hbs', {
        DSAs,rel_DSA
    })
});
app.get('/Placement-Prepration/interview/:id/:question', async (req, res) => {
    // const PPinterviews = await PPinterview.findById(req.params.id)

    res.render('interview_prep.hbs', {
        // PPinterviews
    })
});

 


// ======== POST ROUTE FOR PLACEMENT PREPRATION  ===========

app.post('/upload/Quantitative-aptitude',adminauth,(req,res) => {
    var myData = new PPQA(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPQA:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPQA:true,notsubmitted:true
        })
    });
});

app.post('/upload/Logical-reasoning',adminauth,(req,res) => {
    var myData = new PPLR(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPLR:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPLR:true,notsubmitted:true
        })
    });
});

app.post('/upload/english',adminauth,(req,res) => {
    var myData = new PPenglish(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPenglish:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPenglish:true,notsubmitted:true
        })
    });
});
app.post('/upload/coding',adminauth,(req,res) => {

    // const company_name = req.body.company_name
    // const parsedCompanyTags = JSON.parse(company_name);

    // const parsedtopic_tags = JSON.parse(req.body.topic_tags);

    const parsedCompanyTags = req.body.company_name ? JSON.parse(req.body.company_name) : [];
const parsedtopic_tags = req.body.topic_tags ? JSON.parse(req.body.topic_tags) : [];


    var myData = new DSA({
        question : req.body.question,
        topic:req.body.topic,
        answer:req.body.answer,
        company_tags:parsedCompanyTags ,
        topic:parsedtopic_tags ,
        level:req.body.level,
        
    })
    myData.save().then(() =>{
        res.render('./Admin/uploadquestion.hbs',{
            PPcoding:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPcoding:true,notsubmitted:true
        })
    });
});

app.post('/upload/interview',adminauth,(req,res) => {
    var myData = new PPinterview(req.body)
    myData.save().then(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPinterview:true,submitted:true
        })
        
    }).catch(() =>{
        
        res.render('./Admin/uploadquestion.hbs',{
            PPinterview:true,notsubmitted:true
        })
    });
});








}

